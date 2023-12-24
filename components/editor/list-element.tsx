import { Setting } from "@/lib/editor/editor-types";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  PencilIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import SettingElement, { SettingElementProps } from "./setting-element";

export function SortableItem(props: any) {
  const [open, setOpen] = useState(!props.title);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="border-2 border-muted bg-background rounded-md p-2 md:p-4 flex items-center justify-center gap-4 relative">
        <div
          className="hidden items-center justify-center md:flex"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="text-muted-foreground" />
        </div>
        <div className="flex items-center flex-col gap-2 justify-center md:hidden">
          {props.index > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => props.moveTo(props.id, props.index - 1)}
            >
              <ChevronUpIcon />
            </Button>
          )}
          {!props.isEnd && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => props.moveTo(props.id, props.index + 1)}
            >
              <ChevronDownIcon />
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full h-full">
          <Collapsible open={open} onOpenChange={(o) => setOpen(o)}>
            <div className="flex w-full items-center">
              <div className="w-full text-base flex items-center h-full">
                {props.title || "Untitled"}
              </div>
              <div className="flex justify-end items-center">
                <Button variant="link" onClick={() => setOpen((o) => !o)}>
                  {open ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <PencilIcon className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="link" onClick={() => props.onRemove(props.id)}>
                  <Trash2Icon className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
            <CollapsibleContent>{props.children}</CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-4 gap-2 ">
        <div className="w-full border border-muted" />
        <Button
          variant={"ghost"}
          onClick={() => props.addToList?.(props.index + 1)}
          className="flex flex-row items-center gap-2 whitespace-nowrap"
        >
          <PlusCircleIcon className="h-6 w-6" /> Add New
        </Button>
        <div className="w-full border border-muted" />
      </div>
    </div>
  );
}

export const ListElement = ({
  value,
  setting,
  handleDragEnd,
  updateItem,
  onRemove,
  addToList,
  moveTo,
  ...props
}: {
  value: string | string[];
  setting: Setting;
  updateItem: (args: { index: number; value: any; subField?: string }) => void;
  handleDragEnd: (event: any) => void;
  onRemove?: (id: string) => void;
  addToList?: (index: number) => void;
  moveTo?: (id: string, to: number) => void;
} & SettingElementProps) => {
  const _value = Array.isArray(value) ? value : [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={_value} strategy={verticalListSortingStrategy}>
          <div className="flex gap-4 flex-col">
            {_value.map((subValue: any, i: number) => {
              return (
                <SortableItem
                  key={subValue.id}
                  id={subValue.id}
                  onRemove={onRemove}
                  addToList={addToList}
                  index={i}
                  isEnd={i == _value.length - 1}
                  title={subValue.name || subValue.goal || subValue.description}
                  moveTo={moveTo}
                >
                  {setting.listof == "object" ? (
                    (setting.listSchema || []).map((subField, idx) => {
                      return (
                        <SettingElement
                          {...props}
                          key={`${setting.name}.${i}.${subField.name}`}
                          valueAtLoad={subValue[subField.name] || []}
                          setting={subField}
                          keypath={[...props.keypath, i, subField.name]}
                          updateFn={(subFieldName: string, value: any) => {
                            updateItem({
                              index: i,
                              subField: subFieldName,
                              value: value,
                            });
                          }}
                        />
                      );
                    })
                  ) : (
                    <SettingElement
                      {...props}
                      key={`${setting.name}.${i}._`}
                      valueAtLoad={subValue || null}
                      setting={{
                        ...setting,
                        type: setting.listof as any,
                      }}
                      keypath={[...props.keypath, i]}
                      inlined={true}
                      updateFn={(_: any, value: any) => {
                        updateItem({ index: i, value: value });
                      }}
                    />
                  )}
                </SortableItem>
              );
            })}
            {_value.length == 0 && (
              <div
                key={`add-first-item-${setting.name}`}
                className="w-full flex items-center justify-center mt-4 gap-2 "
              >
                <Button
                  variant={"ghost"}
                  onClick={() => addToList?.(0)}
                  className="flex flex-row items-center gap-2 whitespace-nowrap"
                >
                  <PlusCircleIcon className="h-6 w-6" /> Add First
                </Button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};
