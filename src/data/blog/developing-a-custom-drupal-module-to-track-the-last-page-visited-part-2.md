---
author: Irving Frias
pubDatetime: 2026-01-28T10:00:02Z
modDatetime: 2026-01-28T10:00:00Z
title: Developing a custom Drupal module to track the last page visited (Part 2/4)
slug: developing-a-custom-drupal-module-to-track-the-last-page-visited-part-2
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

**Important note:** Make sure your module is in `modules/custom/` and not directly in `modules/`, as Drupal ignores modules in the root of `modules/` for security reasons.


# **Step 2: Implementing Client-Side Tracking with JavaScript**

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