import { parseStringPromise } from 'xml2js';
import { PB2Map } from '#pb2Map.js';
import type { XLMParseOutput } from '#utils/types.js';

// xml2js can't handle ampersand within an attribute value which isn't rare because pb2 can handle ampersands
function escapeAmpersand(xml: string): string {
	return xml.replaceAll(/&(?!(?:apos|quot|gt|lt|amp);|#)/g, '&amp;');
}

// Main file responsible for processing a given PB2 .xml file..
// pb2XMLFile is a raw string that is obtained from the PB2 .xml file..
const processPB2XMLFile = async (pb2XMLFile: string): Promise<string | undefined> => {
	// We first wrap the whole string with a root xml tag because.. pb2 xml maps have no root xml node and the parser requires it.
	pb2XMLFile = '<root>' + pb2XMLFile + '</root>';

	// Parse the XML string into a javascript object.
	// Refer to xml2js for object layout documentation. For PB2 maps specifically we are primarily concern with extracting the attributes.
	const xmlFile = await parseStringPromise(escapeAmpersand(pb2XMLFile)) as XLMParseOutput;
	// Constructs a valid typed PB2 map from the given XML object.
	const pb2Map = new PB2Map(xmlFile);

	// Serialize the processed PB2 map into source code.
	return pb2Map.serializeToPB3SourceCode();
};

export default processPB2XMLFile;
