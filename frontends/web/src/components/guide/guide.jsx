import { Component, h } from 'preact';
import { translate } from 'react-i18next';
import i18n from '../../i18n/i18n';
import style from './guide.css';

export function Guide({ guide, screen, children }) {
    return (
        <div className={style.wrapper}>
            <div className={style.toggler} onClick={guide.toggle}>{guide.shown ? '✕' : '?'}</div>
            {guide.shown &&
                <div className={'guide ' + style.guide}>
                    <h1>{i18n.t('guide.title')}</h1>
                    {screen && i18n.t('guide.' + screen).map(entry => <Entry entry={entry} />)}
                    {children}
                </div>
            }
        </div>
    );
}

@translate()
export class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shown: props.shown || props.highlighted || (props.entry && props.entry.shown),
            highlighted: props.highlighted || (props.entry && props.entry.highlighted)
        };
    }

    toggle = () => {
        this.setState(state => ({ shown: !state.shown, highlighted: false }));
    }

    render({
        t,
        title,
        entry,
        children,
    }, {
        shown,
        highlighted,
    }) {
        return (
            <div className={highlighted ? style.highlighted : style.entry}>
                <h2 onClick={this.toggle}>
                    {shown ? '–' : '+'} {title || (entry && entry.title)}
                </h2>
                {shown && entry && entry.text.map(p => <p>{p}</p>)}
                {shown && entry && entry.link && <p><a href={entry.link.url} target="_blank" rel="noopener noreferrer">{entry.link.text}</a></p>}
                {shown && children}
            </div>
        );
    }
}
