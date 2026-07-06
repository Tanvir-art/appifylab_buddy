
import React from 'react';

const stories = [
  { id: 1, image: '/assets/images/mobile_story_img.png', name: 'Your Story', isActive: false, isYour: true },
  { id: 2, image: '/assets/images/mobile_story_img1.png', name: 'Ryan...', isActive: true },
  { id: 3, image: '/assets/images/mobile_story_img2.png', name: 'Ryan...', isActive: false },
  { id: 4, image: '/assets/images/mobile_story_img1.png', name: 'Ryan...', isActive: true },
  { id: 5, image: '/assets/images/mobile_story_img2.png', name: 'Ryan...', isActive: false },
  { id: 6, image: '/assets/images/mobile_story_img1.png', name: 'Ryan...', isActive: true },
  { id: 7, image: '/assets/images/mobile_story_img.png', name: 'Ryan...', isActive: false },
  { id: 8, image: '/assets/images/mobile_story_img1.png', name: 'Ryan...', isActive: true },
];

export default function FeedStoryMobile() {
  return (
    <div className="_feed_inner_ppl_card_mobile _mar_b16">
      <div className="_feed_inner_ppl_card_area">
        <ul className="_feed_inner_ppl_card_area_list">
          {stories.map((story) => (
            <li key={story.id} className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className={`_feed_inner_ppl_card_area_story${story.isYour ? '' : story.isActive ? '_active' : '_inactive'}`}>
                  <img src={story.image} alt="Image" className={story.isActive ? '_card_story_img1' : '_card_story_img'} />
                  {story.isYour && (
                    <div className="_feed_inner_ppl_btn">
                      <button className="_feed_inner_ppl_btn_link" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                          <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className={`_feed_inner_ppl_card_area${story.isYour ? '_link' : ''}_txt`}>{story.name}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}