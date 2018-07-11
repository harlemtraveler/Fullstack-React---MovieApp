import React, { Component } from 'react';
import classnames from 'classnames';
import withSideEffect from 'react-side-effect'


export const ContentHeader = ({
    title,
    left,
    right,
    style,
    children,
    className,
    sticky
}) => {
    return children && (
        <div className='contents'>
            <header className={classnames(
                className,
                'contentHeader',
                { sticky: sticky }
            )}
            style={style || {}}>
                {left && <div className='overlay' />}
                <section>
                    <div className='item title'>
                        { title }
                    </div>
                    <div className='left'>{left}</div>
                </section>
                {right}
            </header>
            <div className={classnames(
                className,
                'children',
                { sticky }
            )}>
                {children}
            </div>
        </div>
    )
    // <div className='contents'>
    //     <header className={classnames(
    //         className,
    //         'ContentHeader',
    //         {sticky}
    //     )}>
    //         <section>
    //             <div className='title'>
    //                 {title}
    //             </div>
    //             <div className='left'>
    //                 {left}
    //             </div>
    //         </section>
    //         {right}
    //     </header>
    //     <div className={classnames(
    //         'children',
    //         className,
    //         {sticky}
    //     )}>
    //         {children}
    //     </div>
    // </div>
}

const reducePropsToState = (propsList) => {
    const props = {}
    propsList.forEach(prop => {
        Object.assign(props, prop)
    })
    return props
}
const handleStateChangeOnClient = props => props

export default withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient,
)(ContentHeader)
