  
// Positioning
// position:relative means 'activate top, left'. You can then move it relative to where it would have been in layout already
// position:absolute means 'don't give me space in layout'.
// top and left, if set, are relative to the window or the first parent that's also relative or absolute
// If all children of an are absolute, then element now has no height.

// Size Constraints
// Seems to work as expected by default, including width, height.
// Width, height are always size of content area. outerWidth(true) is everything, with margin

// Overflow
// Doesn't work. Part of layout, and we've turned it off with absolute. 
// My panel's overflow property is now useless



// Next:

// clipping -- for the elment that's absolutely positioned
// apply clip to child if necessary. clip is relative to child's space.
// $child.css('clip', 'rect(0px,60px,200px,0px)');



// TODO: 
// - How to be notified for all cases where layout might change? 
//   - resize of container, added / removed elements
// - make StackPanel work on any element and in multiple places
// - ensure it only does layout when it has children live and connected
// - allow children to size to content (i.e. take up vertical space)
// - define vertical alignment somehow
// - handle clipping / scrolling

(function(){

  var WrapPanel = (function(){

    function WrapPanel(){
      this.$el = $('#container');   // borrow from backbone
    }

    WrapPanel.prototype.children = function(){
      return this.$el.children();
    };

    WrapPanel.prototype.setOffset = function (child, x, y){

    };

    WrapPanel.prototype.layout = function() {
      
      var availableWidth = this.$el.width();
      var offsetX = 0;
      var offsetY = 0;
      var rowHeight = 0;

      this.children().each(function(index, item) {

        var $child = $(item);
        var width = $child.outerWidth(true);
        var height = $child.outerHeight(true);

        rowHeight = rowHeight < height ? height : rowHeight;

        if (offsetX + width > availableWidth && offsetX > 0) // offsetX > 0: if first element in a row is too big for the row, place it anyway.
        {
          offsetY += rowHeight;
          rowHeight = height;  // reset row height for the new row
          offsetX = 0;
        }

        // Lay out the children
        $child.css('position', 'absolute');
        $child.css('transform','translate(' + offsetX + 'px, ' + offsetY + 'px)');
        offsetX += width;

      });

      // Give the panel a height based on the children
      this.$el.height(offsetY + rowHeight);
    };

    return WrapPanel;

  })();


  var StackPanel = (function(){

    function StackPanel(horizontal){

      this.horizontal = (horizontal !== undefined ? horizontal : true)
      this.$el = $('#container');   // borrow from backbone
    }

    StackPanel.prototype.children = function(){
      return this.$el.children();
    };

    StackPanel.prototype.layout = function() {
      // run layout. maybe don't need measure and arrange just yet.

      
      var totalWidth = 0;
      var maxHeight = 0;

      this.children().each(function(index, item) {

        var $child = $(item);
        var width = $child.outerWidth(true);
        var height = $child.outerHeight(true);


        // Lay out the children
        $child.css('position', 'absolute');
        $child.css("transform","translateX(" + totalWidth + "px)");
        totalWidth += width;

        maxHeight = maxHeight < height ? height : maxHeight;

      });

      // Give the panel a width and height based on the children
      this.$el.width(totalWidth);
      this.$el.height(maxHeight);
    };

    return StackPanel;

  })();

  var x;
  $(function(){
  //  x = new StackPanel(true);
    x = new WrapPanel();
    x.layout();
  });

  $(window).resize(function(){
    x.layout();
  });


 
})();