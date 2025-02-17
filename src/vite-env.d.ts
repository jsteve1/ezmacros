/// <reference types="vite/client" />

import { VNode } from 'preact';
import { JSXElementConstructor, ReactElement } from 'react';

declare module '@headlessui/react' {
  interface DialogRenderPropArg {}
  interface TitleRenderPropArg {}
  interface PanelRenderPropArg {}

  interface DialogProps {
    children: VNode | VNode[] | ((bag: DialogRenderPropArg) => ReactElement<any, string | JSXElementConstructor<any>>);
  }

  interface DialogPanelProps {
    children: VNode | VNode[] | ((bag: PanelRenderPropArg) => ReactElement<any, string | JSXElementConstructor<any>>);
    className?: string;
  }

  interface DialogTitleProps {
    children: VNode | VNode[] | ((bag: TitleRenderPropArg) => ReactElement<any, string | JSXElementConstructor<any>>);
    className?: string;
  }

  interface DialogOverlayProps {
    children?: VNode | VNode[];
    className?: string;
  }
}
