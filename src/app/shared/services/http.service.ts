import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { API_URL } from "../../../environments/environment.development";
import { User } from "../models/user.model";
import { Subject } from "rxjs";
import { DateTime } from "luxon";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  public token?: string;
  private spotifyToken?: {
    token?: string;
    refresh_token: string;
    expires_at: DateTime;
  };
  urlParams: any;
  user?: User;
  isInit: boolean = false;
  initPromise: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {
    this.init();
  }
  public async init() {
    this.urlParams = new URLSearchParams(window.location.search);
    if (this.urlParams.has("code")) {
      let code = this.urlParams.get("code") as string;
      let response = await this.requestApi("/auth/callback", "GET", {
        code,
      });
      if (response && response.token) {
        this.user = response.user;
        this.saveTokens(response);
      }
    } else {
      this.token = localStorage.getItem("apiToken")
        ? JSON.parse(localStorage.getItem("apiToken") as string).token
        : undefined;
      if (this.token) {
        await this.getUser();
      }
    }
    this.isInit = true;
    this.initPromise.next(true);
  }
  public async requestApi(
    action: string,
    method: string = "GET",
    datas: any = {},
    httpOptions: any = {}
  ): Promise<any> {
    const methodWanted = method.toLowerCase();
    let route = API_URL + action;
    let req = null;
    if (httpOptions.headers === undefined) {
      httpOptions.headers = new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
    }
    if (this.token) {
      httpOptions.headers = httpOptions.headers.set(
        "Authorization",
        "Bearer " + this.token
      );
    }
    switch (methodWanted) {
      case "post":
        req = this.http.post(route, datas, httpOptions);
        break;
      case "put":
        req = this.http.put(route, datas, httpOptions);
        break;
      case "delete":
        route +=
          "?" +
          Object.keys(datas)
            .map((key) => {
              return key + "=" + datas[key];
            })
            .join("&");
        req = this.http.delete(route, httpOptions);
        break;
      default:
        route +=
          "?" +
          Object.keys(datas)
            .map((key) => {
              return key + "=" + datas[key];
            })
            .join("&");
        req = this.http.get(route, httpOptions);
        break;
    }
    return req.toPromise();
  }
  saveTokens(response: { token: string; user: User }) {
    localStorage.setItem(
      "apiToken",
      JSON.stringify({
        token: response.token,
        expires_at: DateTime.now()
          .plus({ seconds: response.user.spotifyExpiresIn })
          .toISO(),
      })
    );
    this.token = response.token;
  }
  async getUser() {
    await this.requestApi("/api/user", "GET").then(
      (res) => {
        this.user = res;
      },
      (err) => {
        console.error(err);
        this.logout();
      }
    );
  }

  isLogged(): boolean {
    return this.token !== undefined;
  }
  logout() {
    localStorage.removeItem("apiToken");
    localStorage.removeItem("spotifyToken");
    this.token = undefined;
    this.spotifyToken = undefined;
    this.user = undefined;
    this.router.navigate(["/login"]);
  }
}
