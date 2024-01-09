import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Group } from "../models/group.model";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(public http: HttpService) {}

  async createGroup(groupname: string): Promise<Group> {
    return this.http
      .requestApi("/api/group", "POST", { name: groupname })
      .then((res) => {
        return res;
      });
  }

  async joinGroup(grouptoken: string): Promise<Group> {
    return this.http
      .requestApi("/api/group/join/" + grouptoken, "get")
      .then((res) => {
        return res;
      });
  }

  async leaveGroup(grouptoken: string): Promise<string> {
    return this.http
      .requestApi("/api/group/leave/" + grouptoken, "get")
      .then((res) => {
        return res;
      });
  }

  async getGroupByToken(token: string): Promise<Group> {
    return this.http
      .requestApi("/api/group/token/" + token, "get")
      .then((res) => {
        return res;
      });
  }
}
