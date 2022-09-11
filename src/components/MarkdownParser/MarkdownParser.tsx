import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classes from './MarkdownParser.module.css';

type MarkdownParserProps = {
	input: string | string[];
};

const MarkdownParser = ({ input }: MarkdownParserProps) => (
	<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		components={{
			p: ({ children }) => <p style={{ textIndent: '0.7rem' }}>{children}</p>
		}}
		className={classes.markdown}
	>
		{Array.isArray(input)
			? input.reduce<string>((acc, cur) => {
					if (cur.includes('|')) {
						return acc + cur + '\n';
					} else {
						return acc + cur + '\n\n';
					}
			  }, '')
			: input}
	</ReactMarkdown>
);

export default MarkdownParser;
