---
author: Irving Frias
pubDatetime: 2026-01-28T10:00:03Z
modDatetime: 2026-01-28T10:00:00Z
title: Developing a custom Drupal module to track the last page visited (Part 3/4)
slug: developing-a-custom-drupal-module-to-track-the-last-page-visited-part-3
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
