"use client";

import BlogMarquee from './BlogMarquee';

const BlogSectionWrapper = () => {
  return (
    <>
      {/* Carosello Blog - velocità fissa (x1) */}
      <BlogMarquee speedMultiplier={1} />
    </>
  );
};

export default BlogSectionWrapper;

