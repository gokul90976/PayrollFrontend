import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {

  const authFinanceService = inject(AuthService)
  const router = inject(Router)

  if(authFinanceService.isAuthenticated()){
    return true;
  }
  else{
    router.navigate(['']);
    return false;
  }

};
