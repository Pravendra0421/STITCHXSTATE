import React from 'react';
import Image from 'next/image'; 
import image1 from '../../../public/images/Essential2_image1.jpg'
import image2 from '../../../public/images/Essential2_image2.jpg'
import image3 from '../../../public/images/Essential2_image3.jpg'
import { HomepageEntity,BlogPost } from '@/core/entities/HomePage.entity';
interface Props {
  homepageSection: HomepageEntity | null;
}
// Main App component
const App = ({ homepageSection }: Props) => {
  const blogPostSection = homepageSection?.sections?.find(
    (section): section is BlogPost => section.type === 'BlogPost'
  );

  // If no BlogPost section is found, return null or a fallback
  if (!blogPostSection) {
    return null; // Or return a static placeholder if desired
  }

  const {post1,post2,post3}=blogPostSection;
  const defaultImage1Url = 'stitchxstate/public/images/Essential2_image1.jpg';
  const defaultImage2Url = 'stitchxstate/public/images/Essential2_image1.jpg';
  const defaultImage3Url = 'stitchxstate/public/images/Essential2_image1.jpg';
  const post1title=post1.title ||"May 10, 2018";
  const post1description=post1.description ||"Looks we love";
  const post1image=post1.imageUrl ||defaultImage1Url;
  const post1alt=post1.imageAlt ||"Looks"
  
  const post2title=post2.title ||"May 01, 2018";
  const post2description=post2.description ||"10 ways to unwind";
  const post2image=post2.imageUrl ||defaultImage2Url;
  const post2alt=post2.imageAlt ||"Looks"
  
  const post3title=post3.title ||"May 10, 2018";
  const post3description=post3.description ||"Featured designer: Bethany Jones";
  const post3image=post3.imageUrl ||defaultImage3Url;
  const post3alt=post3.imageAlt ||"Looks"
  

  return (
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div  className="flex flex-col items-center bg-white   overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <div className="w-full h-auto overflow-hidden ">
              <Image
                src={post1image}
                alt={post1alt}
                className="w-full h-full object-cover"
                width={370}
                height={450}
              />
            </div>
            {/* Text content */}
            <div className="p-4 text-center">
              <p className="text-[#5B4B43] text-sm mb-1">{post1title}</p>
              <h3 className="text-sm font-semibold text-[#5B4B43]">{post1description}</h3>
            </div>
          </div>
          <div  className="flex flex-col items-center bg-white   overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <div className="w-full h-auto overflow-hidden ">
              <Image
                src={post2image}
                alt={post2alt}
                className="w-full h-full object-cover"
                width={370}
                height={450}
              />
            </div>
            {/* Text content */}
            <div className="p-4 text-center">
              <p className="text-[#5B4B43] text-sm mb-1">{post2title}</p>
              <h3 className="text-sm font-semibold text-[#5B4B43]">{post2description}</h3>
            </div>
          </div>
          <div  className="flex flex-col items-center bg-white   overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <div className="w-full h-auto overflow-hidden ">
              <Image
                src={post3image}
                alt={post3alt}
                className="w-full h-full object-cover"
                width={370}
                height={450}
              />
            </div>
            {/* Text content */}
            <div className="p-4 text-center">
              <p className="text-[#5B4B43] text-sm mb-1">{post3title}</p>
              <h3 className="text-sm font-semibold text-[#5B4B43]">{post3description}</h3>
            </div>
          </div>
       
      </div>
  );
};

export default App;
