import React, { useState } from 'react';

const friends = [
  { name: 'Steve Jobs', title: 'CEO of Apple', avatar: '/assets/images/people1.png', status: '5 minute ago' },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', avatar: '/assets/images/people2.png', online: true },
  { name: 'Dylan Field', title: 'CEO of Figma', avatar: '/assets/images/people3.png', online: true },
];

export default function FriendCard() {
  const [search, setSearch] = useState('');

  return (
    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_feed_top_fixed">
        <div className="_feed_right_inner_area_card_content _mar_b24">
          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
          <span className="_feed_right_inner_area_card_content_txt">
            <a className="_feed_right_inner_area_card_content_txt_link" href="/find-friends">See All</a>
          </span>
        </div>

        <form className="_feed_right_inner_area_card_form">
          <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            className="form-control me-2 _feed_right_inner_area_card_form_inpt"
            type="search"
            placeholder="input search text"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="_feed_bottom_fixed">
        {friends.map((friend, index) => (
          <div key={index} className={`_feed_right_inner_area_card_ppl ${friend.status ? '_feed_right_inner_area_card_ppl_inactive' : ''}`}>
            <div className="_feed_right_inner_area_card_ppl_box">
              <div className="_feed_right_inner_area_card_ppl_image">
                <a href="/profile">
                  <img src={friend.avatar} alt="" className="_box_ppl_img" />
                </a>
              </div>
              <div className="_feed_right_inner_area_card_ppl_txt">
                <a href="/profile">
                  <h4 className="_feed_right_inner_area_card_ppl_title">{friend.name}</h4>
                </a>
                <p className="_feed_right_inner_area_card_ppl_para">{friend.title}</p>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl_side">
              {friend.status ? (
                <span>{friend.status}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}