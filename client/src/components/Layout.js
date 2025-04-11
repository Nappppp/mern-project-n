import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    // 雖然可以寫成<div></div>有時會影響到 CSS 或結構排版你看到的 <> 和 </> 是 React Fragment 的簡寫語法，它的用途是：在不增加多餘的 HTML 標籤的情況下，包裹多個子元素。
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet />
    </>
  );
};

export default Layout;
