import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { Role } from '@app/_models';

//Roles by enums just for authentication purpose for now, need to be replaced with db roles data which is role_id
const users = [
  { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin, role_id: 1 },
  { id: 2, username: 'editor', password: 'user', firstName: 'Editor', lastName: 'User', role: Role.User, role_id: 2 },
  { id: 3, username: 'user1', password: 'user1', firstName: 'Normal', lastName: 'User1', role: Role.User, role_id: 3 },
  { id: 4, username: 'user2', password: 'user2', firstName: 'Normal', lastName: 'User2', role: Role.User, role_id: 3 },
  { id: 5, username: 'user3', password: 'user3', firstName: 'Normal', lastName: 'User3', role: Role.User, role_id: 3 },
  { id: 6, username: 'user4', password: 'user4', firstName: 'Normal', lastName: 'User4', role: Role.User, role_id: 3 },
  { id: 7, username: 'user5', password: 'user5', firstName: 'Normal', lastName: 'User5', role: Role.User, role_id: 3 },
];

const roles = [
  { id: 1, role: 'Admin', permissions: {read: true, write: true, delete: true}},
  { id: 2, role: 'Editor', permissions: {read: true, write: true, delete: false}},
  { id: 3, role: 'User', permissions: {read: true, write: false, delete: false}}
]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/roles') && method === 'GET':
          return getRoles();
        case url.endsWith('/users') && method === 'POST':
          return createUser();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          return next.handle(request);
      }
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find((x) => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `fake-jwt-token.${user.id}`,
      });
    }

    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getRoles() {
      if (!isAdmin()) return unauthorized();
      return ok(roles);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();
      const user = users.find((x) => x.id === idFromUrl());
      return ok(user);
    }

    function createUser() {
      const user = body;
      if (users.find((x) => x.username === user.username)) {
        return error(`Username "${user.username}" is already taken`);
      }
      user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
      users.push(user);
      return ok(user);
    }

    function updateUser() {
      if (!isLoggedIn()) return unauthorized();
      const user = users.find((x) => x.id === idFromUrl());
      Object.assign(users, body);
      return ok(user);
    }

    function deleteUser() {
      if (!isAdmin()) return unauthorized();
      users.splice(users.findIndex((x) => x.id === idFromUrl()), 1);
      return ok();
    }

    // helper functions
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    function unauthorized() {
      return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })).pipe(
        materialize(),
        delay(500),
        dematerialize()
      );
    }

    function error(message: string) {
      return throwError(() => ({ status: 400, error: { message } })).pipe(
        materialize(),
        delay(500),
        dematerialize()
      );
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return currentUser()?.role === Role.Admin;
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get('Authorization')!.split('.')[1]);
      return users.find((x) => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
