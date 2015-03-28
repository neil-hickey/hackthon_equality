(function () {
  "use strict";

  var Widget = {


     toLocation : { waiting : true },

     fromLocation : { waiting : true},

     $townTo : $('#town_to'),

     $townFrom : $('#town_from'),

     $canvas : $('canvas'),

     setToLocation : function (name, latitude, longitude) {


       delete this.toLocation.waiting;

       this.toLocation.name = name;
       this.toLocation.latitude = latitude;
       this.toLocation.longitude = longitude;

       this.drawLocations();

     },


     setFromLocation : function (name, latitude, longitude) {

       delete this.fromLocation.waiting;

       this.fromLocation.name = name;
       this.fromLocation.latitude = latitude;
       this.fromLocation.longitude = longitude;

       this.drawLocations();
     },

     IMAGEEXTENTLEFT  : -10.4685637,
     IMAGEEXTENTRIGHT : -5.3709933,
     IMAGEEXTENTTOP   : 55.4453331,
     IMAGEEXTENTBOTTOM : 51.1499991,

     getXYForLngLat : function (  longitude, latitude ) {

       var x = this.canvas.width * ( longitude - this.IMAGEEXTENTLEFT ) / ( this.IMAGEEXTENTRIGHT - this.IMAGEEXTENTLEFT ),
           y = this.canvas.height  - this.canvas.height * ( latitude - this.IMAGEEXTENTBOTTOM ) / ( this.IMAGEEXTENTTOP - this.IMAGEEXTENTBOTTOM );

       return [x, y];


     },

     drawLocations : function () {

      this.clearCanvas();

      if (!this.toLocation.waiting)
        this.drawLocationToMap(this.toLocation);
      
      if (!this.fromLocation.waiting)
        this.drawLocationToMap(this.fromLocation);
      
      if (!this.toLocation.waiting && !this.toLocation.waiting)
        this.drawLineBetweenTwoLocations(this.fromLocation, this.toLocation);

     },

     drawLocationToMap : function ( loc ) {
      var xy = this.getXYForLngLat(loc.longitude, loc.latitude);
      this.drawEllipse(xy[0], xy[1], 20, 5);

     },


     drawLineBetweenTwoLocations : function (loc1, loc2) {
      var cursor = this.getXYForLngLat(loc1.longitude, loc1.latitude),
          xy2 = this.getXYForLngLat(loc2.longitude, loc2.latitude);

      this.ctx.fillRect(cursor[0], cursor[1], 2, 2);


      while (Math.abs(cursor[0] - xy2[0]) > 3 && Math.abs(cursor[1] - xy2[1]) > 3) {
        if (cursor[0] > xy2[0]) {
          cursor[0]--;
        } else {
          cursor[0]++;
        }

        if (cursor[1] > xy2) {
          cursor[1]--;
        } else {
          cursor[1]++;
        }
        this.ctx.fillRect(cursor[0], cursor[1], 2, 2);
      }


       
     },

     sizeCanvas : function () {
        this.$canvas.css('height', this.$canvas.width() * 1.33);
     },

     clearCanvas : function () {
        this.ctx.drawImage(this.cachedImage, 0,0, this.canvas.width, this.canvas.height);

     },

     drawEllipse : function (centerX, centerY, width, height) {
  
        this.ctx.beginPath();
        
        this.ctx.moveTo(centerX, centerY - height/2); // A1
        
        this.ctx.bezierCurveTo(
          centerX + width/2, centerY - height/2, // C1
          centerX + width/2, centerY + height/2, // C2
          centerX, centerY + height/2); // A2

        this.ctx.bezierCurveTo(
          centerX - width/2, centerY + height/2, // C3
          centerX - width/2, centerY - height/2, // C4
          centerX, centerY - height/2); // A1
       
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.closePath();  
     },

     copyImageToCanvas : function () {

        var img = new Image(),
            that = this;

        img.src= "/image/map.png";
        img.onload = function () {
          that.cachedImage = img;
          that.ctx.drawImage(img, 0,0, that.canvas.width, that.canvas.height);
        };
        
     },

     init : function () {


      this.canvas = Widget.$canvas.get(0);
      this.ctx = Widget.canvas.getContext('2d')

      this.$townTo.geocomplete( { country : 'ie' })
       .bind('geocode:result', function (e, loc) {
        Widget.setToLocation(loc.address_components[0].long_name, loc.geometry.location.k, loc.geometry.location.D);
       })
        
      this.$townFrom.geocomplete( { country : 'ie' })
       .bind('geocode:result', function (e, loc) {
        Widget.setFromLocation(loc.address_components[0].long_name, loc.geometry.location.k, loc.geometry.location.D);
       })

      this.sizeCanvas();
      this.copyImageToCanvas();

     }

     

  };
  
  Widget.init();


   window.widget = Widget;

}());
