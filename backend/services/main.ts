
import { UtilsRoutes } from "./coletor-logs/src/routers/utils-routes";
import { connect } from "./executor-comandos/src/mqtt5";

async function main() {
  connect();
  new UtilsRoutes();

}

main().catch(console.error);
