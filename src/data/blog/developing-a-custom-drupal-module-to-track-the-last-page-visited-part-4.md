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

*Need help with any specific enhancement or have questions about implementing this module in your project? Let me know in the comments below!*