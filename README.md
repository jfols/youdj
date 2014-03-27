YouDJ
=====

[![Stories in Ready](https://badge.waffle.io/jfols/youdj.png)](http://waffle.io/jfols/youdj)

A realtime social music listening experience.

Demo: [youdj.meteor.com](http://youdj.meteor.com)

##SoundCloud Configuration

Create a [SoundCloud App](http://developers.soundcloud.com/) to obtain an API key and store your client_id in `/lib/soundcloud_config.js` like this: 

```javascript
Soundcloud = {};
Soundcloud.client_id = 'your-client-id-goes-here';
```

======
Built with [Meteor](http://meteor.com) in Columbus, Ohio.
