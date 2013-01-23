layer
=====

Comfortable javascript layout engine for html

Background
-----
Layer is a javascript library designed to make the layout of html elements easier. It allows users to specify the placement of elements on the page without having to deal with the quirks of the css box model.

In layer container elements, called panels, own the layout of their children. Currently the only panel is a dockpanel, described below. I'm currently adding more.

Usage
----
Add the layer.js javascript file to your page. 

Add the 'dockpanel' class to the container element you want to use as the panel. Add dock-left, dock-top, etc to each child to specify where it will be placed in the parent.

    <div class="dockpanel">
      <div class="dock-top">1 top</div>
      <div class="dock-left">2 left</div>
      <div class="dock-bottom">3 bottom</div>
      <div class="dock-right">4 right</div>
      <div class="dock-left">5 left</div>
      <div>6 none</div>
    </div>

Look in the samples directory for simple examples.

DockPanel
---
DockPanel is used to create top-level UI, such as a header, footer, sidebar, and content area. It works by adding children, in order, based on where they choose to dock themselves. 

A child specifying dock-top will dock to the top of the panel. It will be stretched horizontally to fill up the width of the panel and keep its own height. 

A child specifying dock-left will be docked to the left side of the panel. It will be streched vertically to fill the remaining available height and keep its own width.

dock-bottom and dock-right behave similarly.

As children are added they dock as specified, taking up the space available. The last child will fill all remaining space, regardless of the dock type specified.

![dockpanel](/docs/dockpanel.jpg "DockPanel")