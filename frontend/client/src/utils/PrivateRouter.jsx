// import React from 'react'
// import context from '../contexts/auth/context'
// import { useContext } from 'react'
// import { Redirect, Route } from 'react-router-dom'

// const PrivateRoute = ({ element: Component, ...rest }) => {

//     const { user } = useContext(context);
//   // Add your own authentication on the below line.
//   const isLoggedIn = AuthService.isLoggedIn()

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         return user? (
//           <Component {...props} />
//         ) : (
//           <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//         )
//       }
//     />
//   )
// }

// export default PrivateRoute
