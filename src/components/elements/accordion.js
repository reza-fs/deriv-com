import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from './typography'
import Chevron from 'images/svg/chevron-bottom.svg'

const Arrow = styled(Chevron)`
    transition: transform 0.2s linear;
    ${props => (props.expanded === 'true' ? 'transform: rotate(-180deg);' : '')}
`

const AccordionHeader = styled.div`
    height: 56px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-2);
    padding: 0 1.6rem;

    ${Text} {
        margin-right: auto;
    }
    &:hover {
        cursor: pointer;
    }
`

const AccordionContentWrapper = styled.div`
    padding: 1.6rem;
`

const AccordionWrapper = styled.div`
    margin-bottom: 1.6rem;
    width: 100%;
    border-radius: 6px;
    box-shadow: 0 16px 20px 0 rgba(0, 0, 0, 0.1);
    background-color: var(--color-white);
`
const TRANSITION_DURATION = 400

// TODO: keyboard events and find a way to add proper focus handling
const Accordion = ({ children }) => {
    const nodes = []

    return <AccordionContent nodes={nodes}>{children}</AccordionContent>
}
Accordion.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    nodes: PropTypes.array,
}

const AccordionContent = ({ children, nodes }) => {
    const [active_idx, setActiveIdx] = useState(-1)

    const toggle = child_idx => {
        const is_closed = active_idx === child_idx || child_idx === -1
        if (is_closed) setActiveIdx(-1)
        else {
            setActiveIdx(child_idx)
        }
    }

    const getHeight = child_idx => {
        if (active_idx === child_idx) {
            return nodes.length > active_idx
                ? nodes[active_idx].ref.children[1].children[0].offsetHeight
                : 'auto'
        }
        return 0
    }

    const render_nodes = React.Children.map(children, (child, child_idx) => {
        const height = getHeight(child_idx)
        const is_expanded = child_idx === active_idx

        return (
            <div>
                <AccordionWrapper
                    key={child_idx}
                    ref={div => {
                        nodes[child_idx] = { ref: div }
                    }}
                >
                    <AccordionHeader
                        onClick={() => toggle(child_idx)}
                        role="button"
                        aria-expanded={is_expanded}
                    >
                        <Text weight="bold">{child.props.header}</Text>
                        <Arrow expanded={is_expanded ? 'true' : 'false'} />
                    </AccordionHeader>
                    <div
                        style={{
                            overflow: 'hidden',
                            transition: `height ${TRANSITION_DURATION}ms ease`,
                            height,
                        }}
                    >
                        <AccordionContentWrapper>{child}</AccordionContentWrapper>
                    </div>
                </AccordionWrapper>
            </div>
        )
    })

    return <>{render_nodes}</>
}

AccordionContent.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    nodes: PropTypes.array,
}

const AccordionItem = ({ text, children }) => {
    return <div header={text}>{children}</div>
}

AccordionItem.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    text: PropTypes.string,
}

export { Accordion, AccordionItem }
