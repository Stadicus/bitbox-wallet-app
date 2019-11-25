/**
 * Copyright 2019 Shift Devices AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, h, RenderableProps } from 'preact';
import { route } from 'preact-router';
import { alertUser } from '../../components/alert/Alert';
import * as style from '../../components/bitboxbase/bitboxbase.css';
import { DetectedBase } from '../../components/bitboxbase/detectedbase';
import { Dialog } from '../../components/dialog/dialog';
import * as dialogStyle from '../../components/dialog/dialog.css';
import { Input } from '../../components/forms';
import { BitBoxBaseLogo } from '../../components/icon';
import { Header } from '../../components/layout';
import { SettingsButton } from '../../components/settingsButton/settingsButton';
import { share } from '../../decorators/share';
import { Store } from '../../decorators/store';
import { translate, TranslateProps } from '../../decorators/translate';
import { apiGet, apiPost } from '../../utils/request';
import { validateIP } from '../../utils/validateIP';
import { setBaseStatus } from './bitboxbase';

interface BitBoxBaseConnectProps {
    bitboxBaseIDs: string[];
    detectedBases: DetectedBitBoxBases;
}

export type BaseStatus = '' | 'connected' | 'unpaired' | 'pairingFailed' | 'passwordNotSet' | 'bitcoinPre' | 'locked' | 'initialized';

export interface ConnectedBases {
    [IP: string]: {
        status: BaseStatus;
    };
}

export interface SharedProps {
    connectedBases: ConnectedBases;
}

export const baseStore = new Store<SharedProps>({
    connectedBases: {},
});

export interface DetectedBitBoxBases {
    [Hostname: string]: string;
}

interface State {
    bitboxBaseIDs: string[];
    manualConnectDialog: boolean;
    ipEntry: string;
    error?: string;
}

type Props = SharedProps & BitBoxBaseConnectProps & TranslateProps;

class BitBoxBaseConnect extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            bitboxBaseIDs: [],
            manualConnectDialog: false,
            ipEntry: '',
        };
    }

    private handleFormChange = event => {
        this.setState({
            error: undefined,
            ipEntry : event.target.value,
        });
    }

    private submit = (event: Event) => {
        event.preventDefault();
        if (!validateIP(this.state.ipEntry)) {
            this.setState({ error: this.props.t('bitboxBase.manualInputInvalid') });
            return;
        }
        let ip: string;
        this.state.ipEntry.includes(':') ? ip = this.state.ipEntry : ip = this.state.ipEntry + ':8845';
        apiPost('bitboxbases/establish-connection', { ip })
        .then(data => {
            if (data.success) {
                this.connect(ip);
                this.setStatusAndRedirect(ip);
            } else {
                alertUser(data.errorMessage);
            }
        });
    }

    private establishConnection = (ip: string) => {
        apiPost('bitboxbases/establish-connection', { ip })
        .then(data => {
            if (data.success) {
                this.connect(ip);
                this.setStatusAndRedirect(ip);
            } else {
                alertUser(data.errorMessage);
            }
        });
    }

    private connect = (ip: string) => {
        apiPost(`bitboxbases/${ip}/connect-base`)
        .then(response => {
            if (!response.success) {
                alertUser(`Could not connect to the BitBoxBase RPC client at ${ip}`);
            }
        });
    }

    private setStatusAndRedirect = (baseID: string) => {
        apiGet(`bitboxbases/${baseID}/status`)
        .then(status => {
            setBaseStatus(status, baseID);
            route(`/bitboxbase/${baseID}`);
        });
    }

    private openManualConnectDialog = () => {
        this.setState({ manualConnectDialog: true });
    }

    private closeManualConnectDialog = () => {
        this.setState({ manualConnectDialog: false });
    }

    public componentWillUpdate() {
        this.setState({bitboxBaseIDs : this.props.bitboxBaseIDs});
    }

    public render(
        {
            t,
            detectedBases,
            bitboxBaseIDs,
        }: RenderableProps<Props>,
        {
            manualConnectDialog,
            ipEntry,
            error,
        }: State,
    ) {
        const bases = Object.entries(detectedBases);
        return (
            <div class="contentWithGuide">
                <div class="container">
                    <Header title={<BitBoxBaseLogo />} />
                    <div class="innerContainer scrollableContainer">
                        <div class="content padded">
                            <div className="columnsContainer">
                                <div className="columns">
                                <div className="column">
                                        <div className="flex flex-row flex-between flex-items-center m-bottom-large">
                                            <label className="labelXLarge m-none">{t('bitboxBase.detectedBases')}</label>
                                            <label
                                                className="labelLarge labelLink m-none flex flex-row flex-items-center"
                                                onClick={this.openManualConnectDialog}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="16" height="16"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                                </svg>
                                                {t('bitboxBase.manualInput')}
                                            </label>
                                        </div>
                                        <div className="box slim divide">
                                            {
                                                bases.length ? bases.map(base => (
                                                    <DetectedBase
                                                        hostname={base[0]}
                                                        ip={base[1]}
                                                        connect={this.establishConnection}/>
                                                )) : (
                                                    <p className="text-center p-top-half p-bottom-half">
                                                        {t('bitboxBase.detectedBasesEmpty')}
                                                    </p>
                                                )
                                            }
                                        </div>
                                        {
                                            manualConnectDialog && (
                                                <Dialog title={t('bitboxBase.manualInput')} onClose={this.closeManualConnectDialog}>
                                                    <form onSubmit={this.submit}>
                                                        <Input
                                                            name="ip"
                                                            onInput={this.handleFormChange}
                                                            label={t('bitboxBase.manualInputLabel')}
                                                            value={ipEntry}
                                                            error={error} />
                                                        <div className={dialogStyle.actions}>
                                                            <button
                                                                className={[style.button, style.primary].join(' ')}
                                                                disabled={ipEntry === ''}
                                                                type="submit"
                                                                >
                                                                {t('bitboxBase.connect')}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </Dialog>
                                            )
                                        }
                                    </div>
                                    <div className="column">
                                        <div className="flex flex-row flex-between flex-items-center m-bottom-large">
                                            <label className="labelXLarge m-none">{t('bitboxBase.connectedBases')}</label>
                                        </div>
                                        <div className="box slim divide">
                                            {
                                                bitboxBaseIDs.length ?  bitboxBaseIDs.map(baseID => {
                                                    let name: string | undefined;
                                                    Object.values(detectedBases).includes(baseID) ? name = Object.keys(detectedBases).find(key => detectedBases[key] === baseID) :
                                                        // FIXME: Resolve a hostname from IP for manual additions
                                                        name = t('bitboxBase.new');
                                                    return <SettingsButton
                                                                onClick={() => this.setStatusAndRedirect(baseID)}
                                                                secondaryText={baseID}>
                                                                {name}
                                                            </SettingsButton>;
                                                }) : (
                                                    <p className="text-center p-top-half p-bottom-half">{t('bitboxBase.detectedBasesEmpty')}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const SharedHOC = (share<SharedProps, BitBoxBaseConnectProps & TranslateProps>(baseStore)(BitBoxBaseConnect));
const TranslatedHOC = translate<BitBoxBaseConnectProps>()(SharedHOC);
export { TranslatedHOC as BitBoxBaseConnect };
