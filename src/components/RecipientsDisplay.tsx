import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'


interface RecipientsProps {
  recipients: string []
  className?: string
}

function RecipientsDisplay({className, recipients}: RecipientsProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [recipientsNumber, setReceipientsNumber] = useState<number>(0);
  const [receipientsEmail, setReceipientsEmail] = useState<string>('');

  const getTextWidth = (text: string): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = '16px Arial, sans-serif';
    const { width } = context.measureText(text)
    return width;
  }

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const totalAvailableWidth = Math.floor(element.clientWidth);

      let width = 0;
      let count = 0;
      for (const recipient of recipients) {
        const textWidth = Math.ceil(getTextWidth(`${recipient}, ...`));
        if ((width + textWidth) > totalAvailableWidth) {
          break;
        }
        count++;
        width += textWidth;
      }

      if (count === recipients.length) {
        setReceipientsNumber(0);
        setReceipientsEmail(recipients.join(', '));
      } else if (count === 0) {
        setReceipientsNumber(recipients.length - 1);
        setReceipientsEmail(`${recipients}, ...`)
      } else {
        setReceipientsNumber(recipients.length - count);
        const displayEmailList = recipients.slice(0, count);
        setReceipientsEmail(`${displayEmailList.join(', ')}, ...`)
      }
    });
    
    observer.observe(element.parentElement!);

    return () => {
      observer.disconnect();
    }
  }, [])


  return (
    <div className={className}>
      <div ref={elementRef} className='recipients-display__email'>
        {receipientsEmail}
      </div>
      {
        recipientsNumber > 0 && 
          <div className='recipients-display__number'>
            +{recipientsNumber}
          </div>
      }
    </div>
  )
}


export default styled(RecipientsDisplay)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  font-family: Arial, sans-serif;

  .recipients-display__email {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .recipients-display__number {
    background-color: var(--color-primary);
    color: #f0f0f0;
    border-radius: 3px;
    padding: 5px 2px;
  }
`
