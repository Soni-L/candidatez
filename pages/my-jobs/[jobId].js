export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function JobApplicationPage(props) {
  return <div>my jobs</div>;
}
