import ReactMarkdown from 'react-markdown';
import classes from './MarkdownParser.module.css';
import { getMarkdownFromStringArray } from '../../services/markdownStringArrayToStringService';
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
		{getMarkdownFromStringArray(input)}
	</ReactMarkdown>
);

export default MarkdownParser;
