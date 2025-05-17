import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

/**
 *Se encarga de proteger rutas 
 *y dar acceso a la app a usuarios logeados
 *consulta a AuthService por los usuarios
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}
  
  /**
   *Verifica queexista usuario logueado para dar acceso 
   *a componentes de la app sino redirige a login
   * @return {*}  {Observable<boolean>}
   * @memberof AuthGuard
  */
  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      take(1),
      map(user => {
        if (user) {
          return true; // Usuario autenticado
        } else {
          this.router.navigate(['/login']); // Redirigir si no hay sesión
          return false;
        }
      })
    );
  }
 
};
