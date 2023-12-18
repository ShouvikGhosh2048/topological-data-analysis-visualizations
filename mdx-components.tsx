import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl my-7">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl my-5">{children}</h3>,
        p: ({ children }) => <p className="my-3">{children}</p>,
        a: ({ children, href }) => <a href={href} className="underline">{children}</a>,
        ul: ({ children }) => <ul className="list-disc pl-7">{children}</ul>,
        ...components
    };
}