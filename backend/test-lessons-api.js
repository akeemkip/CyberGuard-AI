const http = require('http');

// Test the Phishing Detection course
http.get('http://localhost:3000/api/courses/d7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const response = JSON.parse(data);
    const course = response.course;

    console.log('='.repeat(80));
    console.log('COURSE TEST RESULTS');
    console.log('='.repeat(80));
    console.log('\nCourse:', course.title);
    console.log('Total Lessons:', course.lessons?.length || 0);
    console.log('Total Modules:', course.modules?.length || 0);

    console.log('\n' + '='.repeat(80));
    console.log('LESSON DETAILS');
    console.log('='.repeat(80));

    // Check first 5 lessons
    const lessonsToCheck = course.lessons?.slice(0, 5) || [];
    lessonsToCheck.forEach((lesson, index) => {
      console.log(`\n${index + 1}. ${lesson.title}`);
      console.log(`   - Order: ${lesson.order}`);
      console.log(`   - Has Video: ${lesson.videoUrl ? '✅ YES' : '❌ NO'}`);
      if (lesson.videoUrl) {
        console.log(`   - Video URL: ${lesson.videoUrl}`);
      }
      console.log(`   - Content Length: ${lesson.content?.length || 0} characters`);
      console.log(`   - Content Quality: ${lesson.content?.length > 1000 ? '✅ Comprehensive' : lesson.content?.length > 200 ? '⚠️  Medium' : '❌ Short'}`);
      if (lesson.content) {
        console.log(`   - Content Preview: ${lesson.content.substring(0, 100)}...`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));

    const allLessons = course.lessons || [];
    const withVideos = allLessons.filter(l => l.videoUrl).length;
    const comprehensive = allLessons.filter(l => l.content?.length > 1000).length;
    const shortContent = allLessons.filter(l => !l.content || l.content.length < 200).length;

    console.log(`\nTotal Lessons: ${allLessons.length}`);
    console.log(`Lessons with Videos: ${withVideos}/${allLessons.length} (${Math.round(withVideos/allLessons.length*100)}%)`);
    console.log(`Comprehensive Content: ${comprehensive}/${allLessons.length} (${Math.round(comprehensive/allLessons.length*100)}%)`);
    console.log(`Short Content: ${shortContent}/${allLessons.length}`);

    if (shortContent === 0 && comprehensive === allLessons.length) {
      console.log('\n✅ ALL LESSONS HAVE COMPREHENSIVE CONTENT!');
    } else if (shortContent > 0) {
      console.log(`\n⚠️  ${shortContent} lessons still have short content`);
    }

    console.log('\n' + '='.repeat(80));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
