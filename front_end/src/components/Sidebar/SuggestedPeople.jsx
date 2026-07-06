
const people = [
  { name: 'Steve Jobs', title: 'CEO of Apple', avatar: '/assets/images/people1.png' },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', avatar: '/assets/images/people2.png' },
  { name: 'Dylan Field', title: 'CEO of Figma', avatar: '/assets/images/people3.png' },
];

export default function SuggestedPeople() {
  return (
    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_area_suggest_content _mar_b24">
        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
        <span className="_left_inner_area_suggest_content_txt">
          <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
        </span>
      </div>

      {people.map((person, index) => (
        <div key={index} className="_left_inner_area_suggest_info">
          <div className="_left_inner_area_suggest_info_box">
            <div className="_left_inner_area_suggest_info_image">
              <a href="/profile">
                <img src={person.avatar} alt="Image" className="_info_img" />
              </a>
            </div>
            <div className="_left_inner_area_suggest_info_txt">
              <a href="/profile">
                <h4 className="_left_inner_area_suggest_info_title">{person.name}</h4>
              </a>
              <p className="_left_inner_area_suggest_info_para">{person.title}</p>
            </div>
          </div>
          <div className="_left_inner_area_suggest_info_link">
            <a href="#0" className="_info_link">Connect</a>
          </div>
        </div>
      ))}
    </div>
  );
}