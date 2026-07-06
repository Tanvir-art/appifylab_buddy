import ExploreMenu from './ExploreMenu';
import SuggestedPeople from './SuggestedPeople';
import Events from './Events';

export default function LeftSidebar() {
  return (
    <div className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <ExploreMenu />
      </div>
      <div className="_layout_left_sidebar_inner">
        <SuggestedPeople />
      </div>
      <div className="_layout_left_sidebar_inner">
        <Events />
      </div>
    </div>
  );
}