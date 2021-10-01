export default function ({ store, redirect }) {
  // console.log(store.getters['loggedInUser']);
  let user = store.getters['loggedInUser'];

  if(user){
    return redirect('/dashboard');
  }
}
