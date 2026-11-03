import { Accordion, AccordionHeader } from "@components/accordion";
import type { AttachedFile } from "@types";

// mock-up data
type dataProps = {
  data: boardList[];
};
type boardList = {
  seq: string;
  num: number;
  boardTitle: string;
  boardContents: string;
  emcyYn: boolean;
  writerNm: string;
  chgDtm: string;
  fileInfoList: AttachedFile[];
};
export default function List({ data }: dataProps) {
  return (
    <div>
      <AccordionHeader />

      <ul>
        {data.map((accordion) => {
          const {
            seq,
            num,
            boardTitle,
            writerNm,
            chgDtm,
            boardContents,
            emcyYn,
            fileInfoList,
          } = accordion;

          return (
            <li key={`${seq}-${num}`}>
              <Accordion
                id={num}
                title={boardTitle}
                author={writerNm}
                date={chgDtm}
                description={boardContents}
                isUrgent={emcyYn}
                fileInfoList={fileInfoList}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
