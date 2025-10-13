#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 NYCMG - Test Structure Validator');
console.log('====================================\n');

// Define expected test files for each component
const expectedTests = {
  backend: [
    'src/controllers/__tests__/album.controller.test.js',
    'src/controllers/__tests__/artist.controller.test.js',
    'src/controllers/__tests__/comment.controller.test.js',
    'src/controllers/__tests__/follow.controller.test.js',
    'src/controllers/__tests__/genre.controller.test.js',
    'src/controllers/__tests__/like.controller.test.js',
    'src/controllers/__tests__/share.controller.test.js',
    'src/controllers/__tests__/track.controller.test.js',
    'src/middleware/__tests__/sanitize.test.js',
    'src/middleware/__tests__/validation.test.js',
    'src/services/__tests__/album.service.test.js',
    'src/services/__tests__/artist.service.test.js',
    'src/services/__tests__/auth.service.test.js',
    'src/services/__tests__/borough.service.test.js',
    'src/services/__tests__/comment.service.test.js',
    'src/services/__tests__/follow.service.test.js',
    'src/services/__tests__/genre.service.test.js',
    'src/services/__tests__/like.service.test.js',
    'src/services/__tests__/share.service.test.js',
    'src/services/__tests__/track.service.test.js',
    'src/utils/__tests__/passwordValidator.test.js'
  ],
  
  web: [
    'src/components/__tests__/AdvancedSearch.test.js',
    'src/components/__tests__/AlbumList.test.js',
    'src/components/__tests__/ArtistTrackList.test.js',
    'src/components/__tests__/AudioPlayer.test.js',
    'src/components/__tests__/CommentSection.test.js',
    'src/components/__tests__/FollowButton.test.js',
    'src/components/__tests__/LikeButton.test.js',
    'src/components/__tests__/NotificationPanel.test.js',
    'src/components/__tests__/Pagination.test.js',
    'src/components/__tests__/ProfilePictureUpload.test.js',
    'src/components/__tests__/SearchBar.test.js',
    'src/components/__tests__/ShareButton.test.js',
    'src/components/__tests__/SocialInteractionBar.test.js',
    'src/components/__tests__/TrackList.test.js',
    'src/components/__tests__/TrackUpload.test.js'
  ],
  
  mobile: [
    '__tests__/HomeScreen.test.js',
    '__tests__/LoginScreen.test.js',
    '__tests__/RegisterScreen.test.js',
    '__tests__/ArtistProfileScreen.test.js',
    '__tests__/ExploreScreen.test.js'
  ]
};

// Redux slices for mobile
const mobileReduxTests = [
  '__tests__/authSlice.test.js',
  '__tests__/boroughSlice.test.js',
  '__tests__/artistSlice.test.js'
];

let missingFiles = [];
let totalFilesChecked = 0;

// Check each component
Object.keys(expectedTests).forEach(component => {
  console.log(`\n📋 Validating ${component.toUpperCase()} tests...`);
  
  expectedTests[component].forEach(file => {
    totalFilesChecked++;
    const fullPath = path.join(__dirname, '..', component, file);
    
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} (MISSING)`);
      missingFiles.push(`${component}/${file}`);
    }
  });
});

// Check mobile Redux tests (different path structure)
console.log(`\n📋 Validating MOBILE Redux tests...`);
mobileReduxTests.forEach(file => {
  totalFilesChecked++;
  const fullPath = path.join(__dirname, '..', 'mobile', file);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (MISSING)`);
    missingFiles.push(`mobile/${file}`);
  }
});

// Summary
console.log('\n📊 Validation Summary');
console.log('===================');
console.log(`📋 Total files checked: ${totalFilesChecked}`);
console.log(`✅ Files found: ${totalFilesChecked - missingFiles.length}`);
console.log(`❌ Files missing: ${missingFiles.length}`);

if (missingFiles.length === 0) {
  console.log('\n🎉 All test files are present!');
  process.exit(0);
} else {
  console.log('\n⚠️  Missing test files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  process.exit(1);
}