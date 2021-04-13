import retry from "async-retry";
import * as db from "../../db";
import params from "../../params";
import { pause } from "../../utils/asyncFlows";
import { logs } from "../../logs";
import shell from "../../utils/shell";

export async function startAvahiDaemon(): Promise<void> {
  const { internalIp, publicIp } = await waitForIps();

  if (publicIp === internalIp) {
    logs.info(
      "This DAppNode is not behind a router, skipping avahi-publish daemon"
    );
    return;
  }

  // avahi-publish -a -R $MDNS_DOMAIN $IP
  // where -R argument is neccesary only if you want to publish more domains pointing to the same IP
  // It runs in the foreground until it is sent SIGINT (ctrl+c) and during that time all machines
  // on broadcast domain should be able to resolve that domain to the IP
  // See https://github.com/dappnode/DNP_DAPPMANAGER/issues/669

  // > Not necessary to manually SIGINT avahi-publish. DAPPMANAGER does not gracefully shutdown now
  //   so Docker will just kill all processes eventually

  try {
    logs.info("Starting avahi-publish");

    await retry(
      async () =>
        shell(
          `avahi-publish -a -R ${params.AVAHI_LOCAL_DOMAIN} ${internalIp}`,
          { timeout: Infinity }
        ),
      {
        retries: 10,
        maxRetryTime: Infinity,
        maxTimeout: Infinity,
        onRetry: e => logs.error(`Error on avahi-publish`, e)
      }
    );
  } catch (e) {
    logs.error("Too many errors on avahi-publish - stopping daemon", e);
  }
}

/**  Waits for internal IP to be available */
async function waitForIps(): Promise<{ internalIp: string; publicIp: string }> {
  while (true) {
    const internalIp = db.internalIp.get();
    const publicIp = db.publicIp.get();
    if (internalIp && publicIp) return { internalIp, publicIp };
    await pause(1000);
  }
}
