import { Link } from "react-router-dom";


const events = [
  { date: '10', month: 'Jul', title: 'No more terrorism no more cry', going: '17' },
  { date: '10', month: 'Jul', title: 'No more terrorism no more cry', going: '17' },
];

export default function Events() {
  return (
    <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_event_content">
        <h4 className="_left_inner_event_title _title5">Events</h4>
        <Link to="/feed" className="_left_inner_event_link">See all</Link>
      </div>

      {events.map((event, index) => (
        <Link key={index} to="/event-single" className="_left_inner_event_card_link ">
          <div className="_left_inner_event_card">
            <div className="_left_inner_event_card_iamge">
              <img src="/assets/images/feed_event1.png" alt="Image" className="_card_img" />
            </div>
            <div className="_left_inner_event_card_content">
              <div className="_left_inner_card_date">
                <p className="_left_inner_card_date_para">{event.date}</p>
                <p className="_left_inner_card_date_para1">{event.month}</p>
              </div>
              <div className="_left_inner_card_txt">
                <h4 className="_left_inner_event_card_title">{event.title}</h4>
              </div>
            </div>
            <hr className="_underline" />
            <div className="_left_inner_event_bottom">
              <p className="_left_iner_event_bottom">{event.going} People Going</p>
              <Link to="/feed" className="_left_iner_event_bottom_link">Going</Link>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}