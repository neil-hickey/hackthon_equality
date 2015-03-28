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

      if (!this.toLocation.waiting && !this.toLocation.waiting)
        this.drawLineBetweenTwoLocations(this.fromLocation, this.toLocation);

      if (!this.toLocation.waiting)
        this.drawLocationToMap(this.toLocation, this.endImage);
      
      if (!this.fromLocation.waiting)
        this.drawLocationToMap(this.fromLocation, this.startImage);
      

     },

     drawLocationToMap : function ( loc, image ) {
      var xy = this.getXYForLngLat(loc.longitude, loc.latitude);
      //this.drawEllipse(xy[0], xy[1], 20, 5);
      this.ctx.drawImage(image, xy[0]-image.width/2, xy[1]-image.width/2);
     },


     drawLineBetweenTwoLocations : function (loc1, loc2) {
      var xy1 = this.getXYForLngLat(loc1.longitude, loc1.latitude),
          xy2 = this.getXYForLngLat(loc2.longitude, loc2.latitude);

      this.ctx.lineStyle = "#fff";
      this.ctx.lineWidth = 10;

      this.ctx.beginPath();

      this.ctx.moveTo(xy1[0], xy1[1]);
      this.ctx.lineTo(xy2[0], xy2[1]);

      this.ctx.stroke();

       
     },

     sizeCanvas : function () {
        this.$canvas.css('height', this.$canvas.width() * 1.33);
     },

     clearCanvas : function () {
        this.ctx.drawImage(this.cachedImage, 0, 0, this.canvas.width, this.canvas.height);
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

      this.startImage = new Image();
      this.startImage.src = "/image/start.png";

      this.endImage = new Image();
      this.endImage.src = "/image/end.png";

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

     },

     toRadians : function (angle) {
       return value * Math.PI / 180;
     },

     calcCrow : function (lat1, lon1, lat2, lon2) {
        var R = 3963,
            dLat = toRad(lat2-lat1),
            dLon = toRad(lon2-lon1),
            lat1 = toRad(lat1),
            lat2 = toRad(lat2),
            a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
            d = R * c;

        return d;
     }

     

  };
  
  Widget.init();


   window.widget = Widget;

}());
