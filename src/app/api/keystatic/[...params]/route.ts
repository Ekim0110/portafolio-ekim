// API que usa el panel para iniciar sesión con GitHub y guardar los cambios.
import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

export const { POST, GET } = makeRouteHandler({ config });
