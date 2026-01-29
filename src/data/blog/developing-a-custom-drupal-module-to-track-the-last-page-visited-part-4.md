---
author: Irving Frias
pubDatetime: 2026-01-28T10:00:04Z
modDatetime: 2026-01-28T10:00:00Z
title: Developing a custom Drupal module to track the last page visited (Part 4/4)
slug: developing-a-custom-drupal-module-to-track-the-last-page-visited-part-4
featured: false
draft: false
tags:
  - Drupal
  - Custom module
  - User tracking
  - Session management
  - PHP
  - User experience (UX)
  - Hooks
  - Navigation tracking
  - Last page visited
  - Tutorial
  - Development
description:
  Learn how to create a custom Drupal module that tracks the last page visited by each user. Improve UX and gain valuable insights into browsing behavior.
---

## Table of contents


## **Step 4: Advanced Features and Customization**

## **4.1 Adding Configuration Options**

Create a configuration form for site administrators:

### **Create `config/install/last_page_tracker.settings.yml`**

```yaml
track_anonymous: true
track_authenticated: true
enable_cross_session: false
max_history_items: 5
show_timestamp: true
debug_mode: false
```

### **Create `src/Form/LastPageTrackerSettingsForm.php`**

```php
<?php

namespace Drupal\last_page_tracker\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure Last Page Tracker settings.
 */
class LastPageTrackerSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['last_page_tracker.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'last_page_tracker_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('last_page_tracker.settings');

    $form['tracking'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Tracking Settings'),
    ];

    $form['tracking']['track_anonymous'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Track anonymous users'),
      '#default_value' => $config->get('track_anonymous'),
      '#description' => $this->t('Enable tracking for users who are not logged in.'),
    ];

    $form['tracking']['track_authenticated'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Track authenticated users'),
      '#default_value' => $config->get('track_authenticated'),
      '#description' => $this->t('Enable tracking for logged-in users.'),
    ];

    $form['block'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Block Display'),
    ];

    $form['block']['show_timestamp'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show timestamp'),
      '#default_value' => $config->get('show_timestamp'),
      '#description' => $this->t('Display how long ago the page was visited.'),
    ];

    $form['block']['max_history_items'] = [
      '#type' => 'number',
      '#title' => $this->t('Maximum history items'),
      '#default_value' => $config->get('max_history_items'),
      '#min' => 1,
      '#max' => 20,
      '#description' => $this->t('Maximum number of pages to keep in history.'),
    ];

    $form['advanced'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Advanced Settings'),
    ];

    $form['advanced']['enable_cross_session'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable cross-session tracking'),
      '#default_value' => $config->get('enable_cross_session'),
      '#description' => $this->t('Use localStorage to maintain history across browser sessions.'),
    ];

    $form['advanced']['debug_mode'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Debug mode'),
      '#default_value' => $config->get('debug_mode'),
      '#description' => $this->t('Enable console logging for debugging purposes.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('last_page_tracker.settings')
      ->set('track_anonymous', $form_state->getValue('track_anonymous'))
      ->set('track_authenticated', $form_state->getValue('track_authenticated'))
      ->set('show_timestamp', $form_state->getValue('show_timestamp'))
      ->set('max_history_items', $form_state->getValue('max_history_items'))
      ->set('enable_cross_session', $form_state->getValue('enable_cross_session'))
      ->set('debug_mode', $form_state->getValue('debug_mode'))
      ->save();

    parent::submitForm($form, $form_state);
    
    // Clear cache to apply new settings.
    drupal_flush_all_caches();
  }

}
```

### **Create `last_page_tracker.routing.yml`**

```yaml
last_page_tracker.settings:
  path: '/admin/config/system/last-page-tracker'
  defaults:
    _form: '\Drupal\last_page_tracker\Form\LastPageTrackerSettingsForm'
    _title: 'Last Page Tracker Settings'
  requirements:
    _permission: 'administer site configuration'
```

### **Create `last_page_tracker.links.menu.yml`**

```yaml
last_page_tracker.settings:
  title: 'Last Page Tracker'
  parent: 'system.admin_config_system'
  description: 'Configure Last Page Tracker settings'
  route_name: last_page_tracker.settings
  weight: 100
```

## **4.2 Updating the Module to Use Configuration**

Update `last_page_tracker.module`:

```php
/**
 * Implements hook_page_attachments().
 */
function last_page_tracker_page_attachments(array &$attachments) {
  $config = \Drupal::config('last_page_tracker.settings');
  
  // Check if tracking is enabled for current user type.
  $current_user = \Drupal::currentUser();
  if ($current_user->isAnonymous() && !$config->get('track_anonymous')) {
    return;
  }
  if (!$current_user->isAnonymous() && !$config->get('track_authenticated')) {
    return;
  }

  // Get the current node from the route.
  $node = \Drupal::routeMatch()->getParameter('node');
  
  // Only proceed if we're on a node page.
  if (!$node instanceof NodeInterface) {
    return;
  }

  // Prepare the data to pass to JavaScript.
  $tracker_data = [
    'nid' => $node->id(),
    'title' => $node->getTitle(),
    'type' => $node->getType(),
    'debug' => $config->get('debug_mode'),
    'cross_session' => $config->get('enable_cross_session'),
    'show_timestamp' => $config->get('show_timestamp'),
  ];

  // Attach our JavaScript library with the node data.
  $attachments['#attached']['library'][] = 'last_page_tracker/tracking';
  $attachments['#attached']['drupalSettings']['lastPageTracker'] = $tracker_data;
}
```

## **4.3 Updating JavaScript for Configuration Support**

Update `js/last-page-tracker.js` to use configuration:

```javascript
// Update storePageData function
storePageData: function (pageData) {
  try {
    const storageData = {
      nid: pageData.nid,
      title: pageData.title,
      timestamp: pageData.timestamp,
      path: pageData.path,
      url: pageData.url
    };

    // Always store in sessionStorage
    sessionStorage.setItem('drupal_last_page', JSON.stringify(storageData));
    
    // Store in localStorage if cross-session is enabled
    if (drupalSettings.lastPageTracker?.cross_session) {
      localStorage.setItem('drupal_last_page_cross_session', JSON.stringify(storageData));
      
      // Maintain history if configured
      this.addToHistory(storageData);
    }
  }
  catch (e) {
    console.error('Last Page Tracker: Error storing data', e);
  }
},

addToHistory: function (pageData) {
  try {
    const historyKey = 'drupal_last_page_history';
    const maxItems = drupalSettings.lastPageTracker?.max_history_items || 5;
    
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Remove if this page already exists in history
    history = history.filter(item => item.nid !== pageData.nid);
    
    // Add to beginning
    history.unshift(pageData);
    
    // Limit to max items
    if (history.length > maxItems) {
      history = history.slice(0, maxItems);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }
  catch (e) {
    // Silent fail for history
  }
},
```

## **4.4 Testing the Configuration**

1. **Access Configuration:**
   ```bash
   drush config:edit last_page_tracker.settings
   ```
   Or navigate to `/admin/config/system/last-page-tracker`

2. **Test Different Scenarios:**
   - Disable anonymous tracking
   - Enable cross-session storage
   - Change maximum history items
   - Toggle debug mode

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-10.png"
    alt="Configuration form for Last Page Tracker"
  />
</figure>

---

## **Conclusion**

You've successfully created a comprehensive Drupal module that:

✅ **Tracks last page visits** for anonymous and/or authenticated users  
✅ **Stores data client-side** using sessionStorage and localStorage  
✅ **Provides a user-friendly block** to return to last visited pages  
✅ **Offers administrative configuration** for fine-grained control  
✅ **Respects user privacy** with client-side-only storage  
✅ **Includes professional styling** with smooth animations  

### **Key Features Implemented:**

1. **Automatic Tracking**: No user interaction required
2. **Session Persistence**: Data survives page refreshes
3. **Smart Block Display**: Shows context-aware messages
4. **Time Indicators**: "X minutes ago" formatting
5. **Configuration Options**: Flexible tracking rules
6. **Responsive Design**: Works on all device sizes
7. **Performance Optimized**: Zero server load after initial page load

### **Potential Enhancements for Future Versions:**

1. **Statistics Dashboard**: View popular paths and navigation patterns
2. **Integration with Drupal Commerce**: "Continue shopping" functionality
3. **Multilingual Support**: Full translation readiness
4. **GDPR Compliance Tools**: Easy data export/delete for users
5. **API Endpoints**: REST API for external systems to access last page data
6. **Heatmap Integration**: Visual representation of user navigation paths

### **Production Readiness Checklist:**

- [x] Code follows Drupal coding standards
- [x] JavaScript is non-blocking and efficient
- [x] CSS is responsive and accessible
- [x] Configuration is exportable via Drupal's Configuration Management
- [x] Privacy considerations addressed (client-side storage only)
- [x] Performance optimized (minimal server impact)
- [x] User experience polished with smooth transitions

Your module is now ready for deployment on any Drupal 9 or 10 site. It provides immediate value to users by helping them navigate your site more effectively while maintaining privacy and performance standards.

**Next Steps:**
1. Package the module for distribution on Drupal.org
2. Add automated tests with PHPUnit and JavaScript testing
3. Create documentation for site builders and developers
4. Consider adding integration with popular contributed modules

The complete source code for this module is available on [GitHub Repository Link] for easy installation and customization.

---

*Need help with any specific enhancement or have questions about implementing this module in your project? Let me know in the comments below!*# **Step 2: Implementing Client-Side Tracking with JavaScript**

## **2.1 Understanding the Approach**

For our tracking module, we'll use a client-side approach that:
1. **Uses JavaScript** to capture page visits in real-time
2. **Stores data in sessionStorage** for persistence during browser session
3. **Works entirely in the browser** - no server load
4. **Respects user privacy** - data never leaves their device

This architecture provides:
- Real-time tracking without page reloads
- Zero impact on server performance
- Privacy-friendly data storage
- Immediate availability for user experience enhancements

---

## **2.2 Creating the JavaScript File Structure**

First, let's create the necessary directories and files:

```bash
# From your Drupal root directory
cd web/modules/custom/last_page_tracker
mkdir js
mkdir css
touch js/last-page-tracker.js
touch css/last-page-tracker.css
touch last_page_tracker.libraries.yml
```

Your module structure should now look like:
```
web/modules/custom/last_page_tracker/
├── css/
│   └── last-page-tracker.css
├── js/
│   └── last-page-tracker.js
├── last_page_tracker.info.yml
├── last_page_tracker.libraries.yml
└── last_page_tracker.module
```

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-4.png"
    alt="Module structure with JavaScript and CSS directories"
  />
</figure>

## **2.3 Configuring the JavaScript Library**

### **`last_page_tracker.libraries.yml`**

```yaml
tracking:
  version: 1.0
  js:
    js/last-page-tracker.js: {}
  css:
    component:
      css/last-page-tracker.css: {}
  dependencies:
    - core/drupal
    - core/drupalSettings
```

## **2.4 Implementing the JavaScript Tracker**

### **`js/last-page-tracker.js`**

```javascript
/**
 * @file
 * Client-side tracking for last visited page.
 */

(function (Drupal, drupalSettings) {
  'use strict';

  /**
   * Last Page Tracker behavior.
   */
  Drupal.behaviors.lastPageTracker = {
    attach: function (context, settings) {
      // Only run on the main document and if we have node data
      if (context !== document || !settings.lastPageTracker?.nid) {
        return;
      }

      // Extract essential node data
      const currentPage = {
        nid: settings.lastPageTracker.nid,
        title: settings.lastPageTracker.title,
        timestamp: Date.now(),
        path: window.location.pathname,
        url: window.location.href
      };

      // Store in sessionStorage (persists during browser session)
      this.storePageData(currentPage);

      // Optional: Update any existing blocks
      this.updateLastPageBlock(currentPage);

      // Debug logging if enabled
      if (settings.lastPageTracker.debug) {
        console.log('📝 Last Page Tracker: Page stored', currentPage);
      }
    },

    /**
     * Stores page data in sessionStorage.
     */
    storePageData: function (pageData) {
      try {
        // Create a clean storage object with only essential data
        const storageData = {
          nid: pageData.nid,
          title: pageData.title,
          timestamp: pageData.timestamp,
          path: pageData.path,
          url: pageData.url
        };

        // Store in sessionStorage
        sessionStorage.setItem('drupal_last_page', JSON.stringify(storageData));
        
        // Also store in localStorage for cross-session persistence (optional)
        // localStorage.setItem('drupal_last_page_cross_session', JSON.stringify(storageData));
      }
      catch (e) {
        console.error('Last Page Tracker: Error storing data', e);
      }
    },

    /**
     * Updates the last page block if it exists on the page.
     */
    updateLastPageBlock: function (currentPage) {
      const block = document.querySelector('[data-last-page-block]');
      if (block) {
        // Remove any existing "current page" class
        block.classList.remove('current-page');
        
        // Check if this block is showing the current page
        const lastPage = this.getLastPageData();
        if (lastPage && lastPage.nid === currentPage.nid) {
          block.classList.add('current-page');
        }
      }
    },

    /**
     * Retrieves the last page data from storage.
     */
    getLastPageData: function () {
      try {
        const data = sessionStorage.getItem('drupal_last_page');
        return data ? JSON.parse(data) : null;
      }
      catch (e) {
        return null;
      }
    }
  };

  /**
   * Public API for other scripts to access last page data.
   */
  Drupal.lastPageTracker = {
    getLastPage: function () {
      return Drupal.behaviors.lastPageTracker.getLastPageData();
    },
    
    clearHistory: function () {
      try {
        sessionStorage.removeItem('drupal_last_page');
        localStorage.removeItem('drupal_last_page_cross_session');
        return true;
      }
      catch (e) {
        return false;
      }
    },
    
    getHistory: function () {
      // This could be expanded to track multiple pages
      const lastPage = this.getLastPage();
      return lastPage ? [lastPage] : [];
    }
  };

})(Drupal, drupalSettings);
```

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-5.png"
    alt="JavaScript code with comments"
  />
</figure>

## **2.5 Adding Basic Styles**

### **`css/last-page-tracker.css`**

```css
/**
 * @file
 * Basic styles for Last Page Tracker.
 */

/* Visual indicator for debugging */
.last-page-tracker-debug {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
  z-index: 9999;
  display: none;
}

/* Block styles will be added in Step 3 */
.last-page-block {
  transition: all 0.3s ease;
}

.last-page-block.current-page {
  opacity: 0.6;
  pointer-events: none;
}
```

## **2.6 Updating the Module File**

### **`last_page_tracker.module`**

```php
<?php

/**
 * @file
 * Provides functionality to track the last page visited by users.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_page_attachments().
 *
 * Adds JavaScript tracking to node pages.
 */
function last_page_tracker_page_attachments(array &$attachments) {
  // Get the current node from the route.
  $node = \Drupal::routeMatch()->getParameter('node');
  
  // Only proceed if we're on a node page.
  if (!$node instanceof NodeInterface) {
    return;
  }

  // Prepare the data to pass to JavaScript.
  $tracker_data = [
    'nid' => $node->id(),
    'title' => $node->getTitle(),
    'type' => $node->getType(),
    'debug' => \Drupal::state()->get('last_page_tracker.debug', FALSE),
  ];

  // Attach our JavaScript library with the node data.
  $attachments['#attached']['library'][] = 'last_page_tracker/tracking';
  $attachments['#attached']['drupalSettings']['lastPageTracker'] = $tracker_data;
}

/**
 * Implements hook_preprocess_page().
 *
 * Adds last page data to page templates.
 */
function last_page_tracker_preprocess_page(&$variables) {
  // This will be used in Step 3 for block display.
  $variables['#attached']['library'][] = 'last_page_tracker/tracking';
}
```

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-6.png"
    alt="Updated module file with hooks"
  />
</figure>

## **2.7 Testing the Basic Tracking**

### **Step 1: Clear Drupal Cache**
```bash
drush cache:rebuild
```

### **Step 2: Test in Browser**
1. Open your Drupal site in a browser
2. Navigate to a node page
3. Open Developer Tools (F12)
4. Go to the Console tab
5. Type:
   ```javascript
   console.log(JSON.parse(sessionStorage.getItem('drupal_last_page')));
   ```

You should see output like:
```json
{
  "nid": "123",
  "title": "Sample Article",
  "timestamp": 1678901234567,
  "path": "/node/123",
  "url": "https://example.com/node/123"
}
```

### **Step 3: Test Navigation**
1. Visit Node A (ID: 1)
2. Visit Node B (ID: 2)
3. Check sessionStorage again - it should now show Node B
4. Refresh Node B - data should persist
5. Close and reopen browser - data should still be there (sessionStorage persists)

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-7.png"
    alt="Browser console showing stored data"
  />
</figure>

---

## **Step 3: Creating the "Back to Last Page" Block**

## **3.1 Creating the Block Plugin**

Create the block plugin structure:

```bash
cd web/modules/custom/last_page_tracker
mkdir -p src/Plugin/Block
touch src/Plugin/Block/LastPageBlock.php
mkdir templates
touch templates/last-page-block.html.twig
```

### **`src/Plugin/Block/LastPageBlock.php`**

```php
<?php

namespace Drupal\last_page_tracker\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Last Visited Page' block.
 *
 * @Block(
 *   id = "last_page_block",
 *   admin_label = @Translation("Back to Last Page"),
 *   category = @Translation("Navigation")
 * )
 */
class LastPageBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * Constructs a new LastPageBlock.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    RouteMatchInterface $route_match
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->routeMatch = $route_match;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
    array $configuration,
    $plugin_id,
    $plugin_definition
  ) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_route_match')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    // Get current node if we're on a node page.
    $current_node = $this->routeMatch->getParameter('node');
    $current_nid = $current_node ? $current_node->id() : NULL;

    // Build the block render array.
    $build = [
      '#theme' => 'last_page_block',
      '#current_nid' => $current_nid,
      '#attached' => [
        'library' => [
          'last_page_tracker/tracking',
        ],
      ],
      '#cache' => [
        'max-age' => 0, // Don't cache, it's dynamic per user.
        'contexts' => ['session'], // Vary by user session.
      ],
    ];

    return $build;
  }

}
```

## **3.2 Creating the Twig Template**

### **`templates/last-page-block.html.twig`**

```twig
{#
/**
 * @file
 * Template for the Last Page Block.
 *
 * Available variables:
 * - current_nid: The ID of the current node (if on a node page).
 */
#}
<div class="last-page-block" data-last-page-block data-current-nid="{{ current_nid }}">
  <div class="last-page-content">
    <div class="last-page-placeholder">
      <p class="last-page-message">
        {{ 'Your last visited page will appear here.'|t }}
      </p>
    </div>
  </div>
</div>
```

## **3.3 Registering the Theme Hook**

Add to `last_page_tracker.module`:

```php
/**
 * Implements hook_theme().
 */
function last_page_tracker_theme($existing, $type, $theme, $path) {
  return [
    'last_page_block' => [
      'variables' => ['current_nid' => NULL],
      'template' => 'last-page-block',
      'path' => $path . '/templates',
    ],
  ];
}
```

## **3.4 Enhancing JavaScript for Block Functionality**

Update `js/last-page-tracker.js` with block-specific functionality:

```javascript
// Add to existing JavaScript file
Drupal.behaviors.lastPageBlock = {
  attach: function (context, settings) {
    // Find all last page blocks in the current context.
    const blocks = context.querySelectorAll('[data-last-page-block]');
    
    blocks.forEach(block => {
      this.updateBlockContent(block);
    });
  },

  updateBlockContent: function (block) {
    const lastPage = this.getLastPageData();
    const currentNid = block.dataset.currentNid;
    
    if (!lastPage) {
      // No history yet
      this.renderPlaceholder(block);
      return;
    }

    // Don't show link if we're already on that page
    if (lastPage.nid === currentNid) {
      this.renderCurrentPage(block, lastPage);
      return;
    }

    // Show the last page link
    this.renderLastPageLink(block, lastPage);
  },

  getLastPageData: function () {
    try {
      const data = sessionStorage.getItem('drupal_last_page');
      return data ? JSON.parse(data) : null;
    }
    catch (e) {
      return null;
    }
  },

  renderPlaceholder: function (block) {
    const content = `
      <div class="last-page-placeholder">
        <p class="last-page-message">
          ${Drupal.t('Your last visited page will appear here.')}
        </p>
      </div>
    `;
    block.querySelector('.last-page-content').innerHTML = content;
  },

  renderCurrentPage: function (block, pageData) {
    const content = `
      <div class="last-page-current">
        <h3 class="last-page-title">${Drupal.t('Currently Viewing')}</h3>
        <p class="last-page-info">
          <span class="last-page-icon">📍</span>
          <span class="last-page-text">${this.escapeHtml(pageData.title)}</span>
        </p>
      </div>
    `;
    block.querySelector('.last-page-content').innerHTML = content;
    block.classList.add('current-page');
  },

  renderLastPageLink: function (block, pageData) {
    const timeAgo = this.formatTimeAgo(pageData.timestamp);
    
    const content = `
      <div class="last-page-link-container">
        <h3 class="last-page-title">${Drupal.t('Last Visited Page')}</h3>
        <a href="${pageData.path}" class="last-page-link" title="${this.escapeHtml(pageData.title)}">
          <span class="last-page-icon">←</span>
          <span class="last-page-text">${this.escapeHtml(this.truncateText(pageData.title, 50))}</span>
        </a>
        <div class="last-page-meta">
          <span class="last-page-time">${timeAgo}</span>
        </div>
      </div>
    `;
    block.querySelector('.last-page-content').innerHTML = content;
    block.classList.remove('current-page');
  },

  escapeHtml: function (text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  truncateText: function (text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  formatTimeAgo: function (timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert to seconds
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return Drupal.t('Just now');
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return Drupal.t('@minutes min ago', { '@minutes': minutes });
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return Drupal.t('@hours hours ago', { '@hours': hours });
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return Drupal.t('@days days ago', { '@days': days });
    }
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
};
```

## **3.5 Enhancing CSS for the Block**

Update `css/last-page-tracker.css`:

```css
/* Block styles */
.last-page-block {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.last-page-block.current-page {
  background: #e9ecef;
  border-color: #ced4da;
}

.last-page-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.last-page-placeholder .last-page-message {
  color: #6c757d;
  font-style: italic;
  margin: 0;
  text-align: center;
  padding: 10px 0;
}

.last-page-current .last-page-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #495057;
  margin: 0;
  padding: 8px 0;
}

.last-page-current .last-page-icon {
  font-size: 16px;
}

.last-page-link-container {
  animation: fadeIn 0.5s ease;
}

.last-page-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #0073b9;
  text-decoration: none;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.last-page-link:hover {
  background: #f1f8ff;
  border-color: #0073b9;
  color: #0056b3;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 115, 185, 0.1);
}

.last-page-link .last-page-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.last-page-link .last-page-text {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.last-page-meta {
  display: flex;
  justify-content: flex-end;
}

.last-page-time {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .last-page-block {
    padding: 15px;
    margin: 15px 0;
  }
  
  .last-page-link {
    padding: 10px;
  }
}
```

## **3.6 Installing and Configuring the Block**

### **Step 1: Clear Caches**
```bash
drush cache:rebuild
```

### **Step 2: Place the Block**
1. Navigate to `/admin/structure/block`
2. Click "Place block" in your desired region
3. Search for "Back to Last Page"
4. Configure block settings:
   - **Region:** Choose where to display (Sidebar, Content, etc.)
   - **Visibility:** Configure as needed
   - **Save block**

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-8.png"
    alt="Block placement interface in Drupal"
  />
</figure>

### **Step 3: Test the Complete Flow**
1. **Visit Homepage:** Block shows placeholder message
2. **Visit Node A:** Block still shows placeholder (no history yet)
3. **Visit Node B:** Block shows link to Node A
4. **Visit Node C:** Block shows link to Node B
5. **Refresh Node C:** Block still shows link to Node B
6. **Return to Node B:** Block shows "Currently Viewing" message

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-9.png"
    alt="Working block showing last page link"
  />
</figure>

---

## **Step 4: Advanced Features and Customization**

## **4.1 Adding Configuration Options**

Create a configuration form for site administrators:

### **Create `config/install/last_page_tracker.settings.yml`**

```yaml
track_anonymous: true
track_authenticated: true
enable_cross_session: false
max_history_items: 5
show_timestamp: true
debug_mode: false
```

### **Create `src/Form/LastPageTrackerSettingsForm.php`**

```php
<?php

namespace Drupal\last_page_tracker\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure Last Page Tracker settings.
 */
class LastPageTrackerSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['last_page_tracker.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'last_page_tracker_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('last_page_tracker.settings');

    $form['tracking'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Tracking Settings'),
    ];

    $form['tracking']['track_anonymous'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Track anonymous users'),
      '#default_value' => $config->get('track_anonymous'),
      '#description' => $this->t('Enable tracking for users who are not logged in.'),
    ];

    $form['tracking']['track_authenticated'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Track authenticated users'),
      '#default_value' => $config->get('track_authenticated'),
      '#description' => $this->t('Enable tracking for logged-in users.'),
    ];

    $form['block'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Block Display'),
    ];

    $form['block']['show_timestamp'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show timestamp'),
      '#default_value' => $config->get('show_timestamp'),
      '#description' => $this->t('Display how long ago the page was visited.'),
    ];

    $form['block']['max_history_items'] = [
      '#type' => 'number',
      '#title' => $this->t('Maximum history items'),
      '#default_value' => $config->get('max_history_items'),
      '#min' => 1,
      '#max' => 20,
      '#description' => $this->t('Maximum number of pages to keep in history.'),
    ];

    $form['advanced'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Advanced Settings'),
    ];

    $form['advanced']['enable_cross_session'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable cross-session tracking'),
      '#default_value' => $config->get('enable_cross_session'),
      '#description' => $this->t('Use localStorage to maintain history across browser sessions.'),
    ];

    $form['advanced']['debug_mode'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Debug mode'),
      '#default_value' => $config->get('debug_mode'),
      '#description' => $this->t('Enable console logging for debugging purposes.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('last_page_tracker.settings')
      ->set('track_anonymous', $form_state->getValue('track_anonymous'))
      ->set('track_authenticated', $form_state->getValue('track_authenticated'))
      ->set('show_timestamp', $form_state->getValue('show_timestamp'))
      ->set('max_history_items', $form_state->getValue('max_history_items'))
      ->set('enable_cross_session', $form_state->getValue('enable_cross_session'))
      ->set('debug_mode', $form_state->getValue('debug_mode'))
      ->save();

    parent::submitForm($form, $form_state);
    
    // Clear cache to apply new settings.
    drupal_flush_all_caches();
  }

}
```

### **Create `last_page_tracker.routing.yml`**

```yaml
last_page_tracker.settings:
  path: '/admin/config/system/last-page-tracker'
  defaults:
    _form: '\Drupal\last_page_tracker\Form\LastPageTrackerSettingsForm'
    _title: 'Last Page Tracker Settings'
  requirements:
    _permission: 'administer site configuration'
```

### **Create `last_page_tracker.links.menu.yml`**

```yaml
last_page_tracker.settings:
  title: 'Last Page Tracker'
  parent: 'system.admin_config_system'
  description: 'Configure Last Page Tracker settings'
  route_name: last_page_tracker.settings
  weight: 100
```

## **4.2 Updating the Module to Use Configuration**

Update `last_page_tracker.module`:

```php
/**
 * Implements hook_page_attachments().
 */
function last_page_tracker_page_attachments(array &$attachments) {
  $config = \Drupal::config('last_page_tracker.settings');
  
  // Check if tracking is enabled for current user type.
  $current_user = \Drupal::currentUser();
  if ($current_user->isAnonymous() && !$config->get('track_anonymous')) {
    return;
  }
  if (!$current_user->isAnonymous() && !$config->get('track_authenticated')) {
    return;
  }

  // Get the current node from the route.
  $node = \Drupal::routeMatch()->getParameter('node');
  
  // Only proceed if we're on a node page.
  if (!$node instanceof NodeInterface) {
    return;
  }

  // Prepare the data to pass to JavaScript.
  $tracker_data = [
    'nid' => $node->id(),
    'title' => $node->getTitle(),
    'type' => $node->getType(),
    'debug' => $config->get('debug_mode'),
    'cross_session' => $config->get('enable_cross_session'),
    'show_timestamp' => $config->get('show_timestamp'),
  ];

  // Attach our JavaScript library with the node data.
  $attachments['#attached']['library'][] = 'last_page_tracker/tracking';
  $attachments['#attached']['drupalSettings']['lastPageTracker'] = $tracker_data;
}
```

## **4.3 Updating JavaScript for Configuration Support**

Update `js/last-page-tracker.js` to use configuration:

```javascript
// Update storePageData function
storePageData: function (pageData) {
  try {
    const storageData = {
      nid: pageData.nid,
      title: pageData.title,
      timestamp: pageData.timestamp,
      path: pageData.path,
      url: pageData.url
    };

    // Always store in sessionStorage
    sessionStorage.setItem('drupal_last_page', JSON.stringify(storageData));
    
    // Store in localStorage if cross-session is enabled
    if (drupalSettings.lastPageTracker?.cross_session) {
      localStorage.setItem('drupal_last_page_cross_session', JSON.stringify(storageData));
      
      // Maintain history if configured
      this.addToHistory(storageData);
    }
  }
  catch (e) {
    console.error('Last Page Tracker: Error storing data', e);
  }
},

addToHistory: function (pageData) {
  try {
    const historyKey = 'drupal_last_page_history';
    const maxItems = drupalSettings.lastPageTracker?.max_history_items || 5;
    
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Remove if this page already exists in history
    history = history.filter(item => item.nid !== pageData.nid);
    
    // Add to beginning
    history.unshift(pageData);
    
    // Limit to max items
    if (history.length > maxItems) {
      history = history.slice(0, maxItems);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }
  catch (e) {
    // Silent fail for history
  }
},
```

## **4.4 Testing the Configuration**

1. **Access Configuration:**
   ```bash
   drush config:edit last_page_tracker.settings
   ```
   Or navigate to `/admin/config/system/last-page-tracker`

2. **Test Different Scenarios:**
   - Disable anonymous tracking
   - Enable cross-session storage
   - Change maximum history items
   - Toggle debug mode

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-10.png"
    alt="Configuration form for Last Page Tracker"
  />
</figure>

---

## **Conclusion**

You've successfully created a comprehensive Drupal module that:

✅ **Tracks last page visits** for anonymous and/or authenticated users  
✅ **Stores data client-side** using sessionStorage and localStorage  
✅ **Provides a user-friendly block** to return to last visited pages  
✅ **Offers administrative configuration** for fine-grained control  
✅ **Respects user privacy** with client-side-only storage  
✅ **Includes professional styling** with smooth animations  

### **Key Features Implemented:**

1. **Automatic Tracking**: No user interaction required
2. **Session Persistence**: Data survives page refreshes
3. **Smart Block Display**: Shows context-aware messages
4. **Time Indicators**: "X minutes ago" formatting
5. **Configuration Options**: Flexible tracking rules
6. **Responsive Design**: Works on all device sizes
7. **Performance Optimized**: Zero server load after initial page load

### **Potential Enhancements for Future Versions:**

1. **Statistics Dashboard**: View popular paths and navigation patterns
2. **Integration with Drupal Commerce**: "Continue shopping" functionality
3. **Multilingual Support**: Full translation readiness
4. **GDPR Compliance Tools**: Easy data export/delete for users
5. **API Endpoints**: REST API for external systems to access last page data
6. **Heatmap Integration**: Visual representation of user navigation paths

### **Production Readiness Checklist:**

- [x] Code follows Drupal coding standards
- [x] JavaScript is non-blocking and efficient
- [x] CSS is responsive and accessible
- [x] Configuration is exportable via Drupal's Configuration Management
- [x] Privacy considerations addressed (client-side storage only)
- [x] Performance optimized (minimal server impact)
- [x] User experience polished with smooth transitions

Your module is now ready for deployment on any Drupal 9 or 10 site. It provides immediate value to users by helping them navigate your site more effectively while maintaining privacy and performance standards.

