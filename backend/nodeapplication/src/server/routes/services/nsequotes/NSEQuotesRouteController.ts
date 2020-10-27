//Modified
import { Response, Request } from "express";
import { NSEQuotes } from "@services/nsequotes/NSEQuotes";
import { StatusConstants } from "@constants/StatusConstants";
import { AbstractServiceRouteController } from "../AbstractServiceRouteController";
import Axios from "axios";

export interface INSEQuotesServiceInput {
  symbol: string;
}
export class NSEQuotesRouteController extends AbstractServiceRouteController {
  constructor() {
    super("/nsequotes");
    console.log(this.serverLink + "/nsequotes/optionchain");
    this.router
      .get("/nsequotes/optionchain", this.getOptionData.bind(this))
      .bind(this);
  }

  static cookie: string = "";

  public async InitializeController() {
    await this.InitializeGet();
    await this.InitializePost();

    let resp = await Axios.get("https://www.nseindia.com/", {
      withCredentials: true,
    });

    let cookieArray = resp.headers["set-cookie"];
    let cookie = "";
    cookieArray.forEach((cookieStr: string) => {
      cookie = ";" + cookieStr;
    });
    cookie = cookie.substr(1);

    NSEQuotesRouteController.cookie = cookie;
    console.log(resp);
  }

  public async runService(req: Request, resp: Response): Promise<any> {
    let input: INSEQuotesServiceInput = req.query;
    try {
      let response = await NSEQuotes.executeService(input);
      resp.status(StatusConstants.code200).json(response);
    } catch (error) {
      resp.status(400).send("Error");
    }
  }

  public async getOptionData(req: Request, resp: Response): Promise<any> {
    let input: INSEQuotesServiceInput = req.query;
    let response = await NSEQuotes.optionDataService(input);
    resp.status(StatusConstants.code200).json(response);
  }
}
