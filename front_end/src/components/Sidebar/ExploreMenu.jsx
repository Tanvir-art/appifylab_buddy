 
const menuItems = [
  { icon: 'learning', label: 'Learning', badge: 'New' },
  { icon: 'insights', label: 'Insights' },
  { icon: 'friends', label: 'Find friends' },
  { icon: 'bookmarks', label: 'Bookmarks' },
  { icon: 'group', label: 'Group' },
  { icon: 'gaming', label: 'Gaming', badge: 'New' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'save', label: 'Save post' },
];

export default function ExploreMenu() {
  return (
    <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
      <ul className="_left_inner_area_explore_list">
        {menuItems.map((item, index) => (
          <li key={index} className="_left_inner_area_explore_item _explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" fill="#666" opacity="0.2"/>
              </svg>
              {item.label}
            </a>
            {item.badge && (
              <span className="_left_inner_area_explore_link_txt">{item.badge}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}