import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import classes from "./NavBar.module.css";
import { useRouter } from "next/router";
import ROUTES from "../../constants/routes";

function NavBar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  function logoutHandler() {
    signOut();
  }

  function profileHandler() {
    router.replace(`/${ROUTES.PROFILE}`);
  }

  return (
    <header className={classes.header}>
      <Link href="/">
        <a>
          <div className={classes.logo}>All Jobs</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && !loading && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {session && (
            <>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
              <li>
                <button onClick={profileHandler}>Profile</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
