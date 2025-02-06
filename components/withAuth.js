// // components/withAuth.js
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { getAuth } from 'firebase/auth';

// const withAuth = (WrappedComponent) => {
//   return (props) => {
//     const router = useRouter();
//     const auth = getAuth();

//     useEffect(() => {
//       const user = auth.currentUser;
//       if (!user) {
//         router.push('/admin/login'); // Redirect to login if not logged in
//       } else {
//         // Optionally check user role here if needed
//       }
//     }, [auth, router]);

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;
