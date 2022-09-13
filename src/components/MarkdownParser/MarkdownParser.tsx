import ReactMarkdown from 'react-markdown';
import classes from './MarkdownParser.module.css';
import remarkGfm from 'remark-gfm';

type MarkdownParserProps = {
	input: string | string[];
};

const MarkdownParser = ({ input }: MarkdownParserProps) => (
	<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		components={{
			p: ({ children }) => <p className={classes.paragraph}>{children}</p>
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
