import {
  // login as imLogin,
  logout as imLogout,
} from './reducer';

export function login(connect: any, params):any {
  return (dispatch) => {
    connect.open({
      ...params,
      appKey: window.GLOBAL_CONFIG.LIVE_CONFIG.ck,
      // success(res) {
      //   dispatch(imLogin({ ...params, ...res.user }));
      // },
    });
  };
}

export function logout(connect: any):any {
  return (dispatch) => {
    connect.close('logout');
    dispatch(imLogout());
  };
}

export function relogin(connect: any, params):any {
  return (dispatch) => {
    connect.close('logout');
    dispatch(imLogout());

    dispatch(login(connect, params));
  };
}
