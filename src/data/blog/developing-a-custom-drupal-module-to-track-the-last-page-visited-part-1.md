---
author: Irving Frias
pubDatetime: 2026-01-28T10:00:01Z
modDatetime: 2026-01-28T10:00:00Z
title: Developing a custom Drupal module to track the last page visited (Part 1/4)
slug: developing-a-custom-drupal-module-to-track-the-last-page-visited-part-1
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
  Discover why tracking user navigation in Drupal is crucial for improving user experience. Learn the foundational concepts and architecture needed to build a custom module that records each user's last visited page, setting the stage for personalized engagement.
---

## Table of contents

## **Introduction**
Have you ever left a website and, upon returning, found yourself lost, unable to remember which section you were in or what content you were viewing? This frustrating experience is more common than we think, and as Drupal developers, we have the power to fix it.

In the Drupal ecosystem, although there are tracking and analytics modules, many are overly complex for specific needs, depend on third-party services, or do not offer the flexibility we need to integrate the “last page visited” data directly into our business logic.
### **When would you use this module?**
1.  **E-commerce:** Display “continue shopping” or remember the last category visited

2.  **Online courses:** Allow students to pick up exactly where they left off in the lesson

3.  **Forums/communities:** Take users back to the thread they were reading
    
4.  **Content sites:** Suggest “continue reading” after interruptions
    
5.  **Internal applications:** Maintain work context between sessions
    
6.  **Behavior analysis:** Understanding drop-off points without Google Analytics
    

**The solution:** A lightweight custom module that integrates natively with Drupal, without external dependencies, and that we can tailor exactly to our needs. Let's create it!
## **Step 1: Generating the Module Structure with Drush**
We start by using **Drush**, the essential CLI tool for any Drupal developer. If you don't have Drush installed, you can do so with:

```php
composer require drush/drush
```
### **1.1 Generating the module skeleton**

We execute the following command from the root of our Drupal project:

```bash
drush generate module
```
<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-1.png"
    alt="Drush command"
  />
</figure>

### **1.2 Completing the basic configuration**

Drush will guide us with interactive questions:
```bash
 Module name:
 ➤ Last Page Tracker

 Module machine name [last_page_tracker]:
 ➤ last_page_tracker

 Module description:
 ➤ Tracks and stores the last page visited by each user.

 Package [Custom]:
 ➤ Custom

 Dependencies (comma separated):
 ➤ 

 Would you like to create module file? [No]:
 ➤ Yes

 Would you like to create install file? [No]:
 ➤ No

 Would you like to create README.md file? [No]:
 ➤ No
```
### **1.3 Generated structure**

After completing the wizard, Drush will create the following structure:
```text
modules/custom/last_page_tracker/
├── last_page_tracker.info.yml
└── last_page_tracker.module
```
<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-2.png"
    alt="Drush command"
  />
</figure>

### **1.4 Checking the .info.yml file**
Open `last_page_tracker.info.yml` to view the base configuration:
```yaml
name: 'Last Page Tracker'
type: module
description: 'Tracks and stores the last page visited by each user.'
package: Custom
core_version_requirement: ^10 || ^11
```
### **1.5 Enabling the module**
```bash
drush pm:enable last_page_tracker
```
Or from the Drupal administrative interface:

- Navigate to `/admin/modules`
- Search for “Last Page Tracker” in the “Custom” section
- Check the box and click “Install”

<figure>
  <img
    src="/assets/images/developing-a-custom-drupal-module-to-track-the-last-page-visited/step-3.png"
    alt="Drush command"
  />
</figure>

✅ **Congratulations!** You have created the basis for your custom module. In the next step, we will begin to implement the tracking logic using Drupal hooks.

**Important note:** Make sure your module is in `modules/custom/` and not directly in `modules/`, as Drupal ignores modules in the root of `modules/` for security reasons.
