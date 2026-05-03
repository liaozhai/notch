import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { allLocales, getLocale, setLocale } from "../../localization.js";

@customElement("locale-picker")
export class LocalePicker extends LitElement {
    static styles = css`
        select {
            font-size: 1rem;
            border: var(--border);
            font-family: var(--font-family);
            line-height: 1.5;
            font-weight: 400;
        }
    `;
    render() {
        return html`
            <select @change=${this.localeChanged}>
                ${allLocales.map(
                    (locale: string) =>
                        html`<option
                            value=${locale}
                            ?selected=${locale === getLocale()}
                        >
                            ${locale}
                        </option>`
                )}
            </select>
        `;
    }

    async localeChanged(event: Event) {
        const newLocale = (event.target as HTMLSelectElement).value;
        await setLocale(newLocale);
        // const url = new URL(window.location.href);
        // if (url.searchParams.get("locale") !== newLocale) {
        //     url.searchParams.set("locale", newLocale);
        //     window.location.assign(url.href);
        // }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "locale-picker": LocalePicker;
    }
}
