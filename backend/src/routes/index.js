const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const boroughRoutes = require('./borough.routes');
const genreRoutes = require('./genre.routes');
const artistRoutes = require('./artist.routes');
const trackRoutes = require('./track.routes');
const albumRoutes = require('./album.routes');
const trackUploadRoutes = require('./trackUpload.routes');
const notificationRoutes = require('./notification.routes');
const followRoutes = require('./follow.routes');
const commentRoutes = require('./comment.routes');
const likeRoutes = require('./like.routes');
const shareRoutes = require('./share.routes');
const eventRoutes = require('./event.routes');
const venueRoutes = require('./venue.routes');
const ticketRoutes = require('./ticket.routes');
const subscriptionRoutes = require('./subscription.routes');
const paymentRoutes = require('./payment.routes');
const analyticsRoutes = require('./analytics.routes');
const moderationRoutes = require('./moderation.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/boroughs', boroughRoutes);
router.use('/genres', genreRoutes);
router.use('/artists', artistRoutes);
router.use('/tracks', trackRoutes);
router.use('/albums', albumRoutes);
router.use('/track-upload', trackUploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/follow', followRoutes);
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/shares', shareRoutes);
router.use('/events', eventRoutes);
router.use('/venues', venueRoutes);
router.use('/tickets', ticketRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/payments', paymentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/moderation', moderationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;