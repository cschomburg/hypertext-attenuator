import { html, useCallback } from "../deps.js";
import { useStore } from "../store.js";

export default function Settings() {
  const [relayUrl, setRelayUrl] = useStore.config.relayUrl();

  const inputRelayUrl = useCallback((e) => {
    setRelayUrl(e.target.value);
  });

  return html`
        <div class="container mx-auto mt-5">
            <h1 class="text-xl font-bold text-mango-700 my-10">Settings</h1>

            <div>
                <label>
                    Relay server URL
                    <input class="border ml-5" type="text" value="${relayUrl}" onInput="${inputRelayUrl}" />
                </label>
            </div>
        </div>
    `;
}
