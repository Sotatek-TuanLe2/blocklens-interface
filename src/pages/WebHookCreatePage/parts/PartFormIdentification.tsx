import React, { useEffect, FC, useState, useCallback } from 'react';
import 'src/styles/pages/AppDetail.scss';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/CreateHookForm.scss';
import { Box, Text } from '@chakra-ui/react';
import { IAppResponse } from 'src/utils/utils-app';
import {
  AppEditable,
  AppEditableTags,
  AppComplete,
  AppEditable2,
} from 'src/components';
import { IDataForm } from '..';

interface IPartFormIdentificationProps {
  dataForm: IDataForm;
  setDataForm: (value: IDataForm) => void;
  validator: any;
}

interface IOptionProject {
  value: string;
  label: string;
  isNew?: boolean;
}

const PartFormIdentification: FC<IPartFormIdentificationProps> = ({
  dataForm,
  setDataForm,
  validator,
}) => {
  const [optionProjects, setOptionProject] = useState<IOptionProject[]>([]);
  const [newProject, setNewProject] = useState<string>('Untitled project X');

  const getProjects = useCallback(async () => {
    try {
      const res = await rf.getRequest('AppRequest').getListApp({});
      setOptionProject(
        res.docs.map((el: IAppResponse) => ({
          value: el.appId,
          label: el.name || '',
        })),
      );
    } catch (error: any) {
      setOptionProject([]);
    }
  }, []);

  const onChangeProject = (value: string) => {
    if (dataForm.projectId === value) return;

    setDataForm({ ...dataForm, projectId: value });
  };

  const onSubmitNewProject = (
    value: string,
    onOpen?: (isOpen: boolean) => void,
  ) => {
    setNewProject('Untitled project X');
    setOptionProject([
      ...optionProjects,
      {
        value,
        label: value,
        isNew: true,
      },
    ]);
    setDataForm({ ...dataForm, projectId: value });
    onOpen?.(false);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <>
        <Text pb={1} className="title">
          Webhook Name
        </Text>
        <AppEditable
          value={dataForm.webHookName}
          onChange={(value) => {
            setDataForm({
              ...dataForm,
              webHookName: value,
            });
          }}
          validate={{
            name: `name`,
            validator: validator.current,
            rule: ['required'],
          }}
        />
        <Text pb={1} pt={5} className="title">
          Hashtag
        </Text>
        <AppEditableTags
          onSubmit={(value) => {
            const hashTags = dataForm?.hashTags || [];
            if (!value || hashTags.includes(value)) return;
            setDataForm({
              ...dataForm,
              hashTags: [...hashTags, value],
            });
          }}
          onRemove={(value) => {
            const hashTags = dataForm?.hashTags || [];
            const newValue = hashTags.filter((tag) => value !== tag);
            setDataForm({
              ...dataForm,
              hashTags: newValue,
            });
          }}
          tags={dataForm?.hashTags || []}
        />
        <Text pt={5} pb={1} className="title">
          Project
        </Text>

        <AppComplete
          size="large"
          options={optionProjects}
          value={dataForm?.projectId || ''}
          onChange={onChangeProject}
          placeholder="Add to a project"
          extraFooter={(onOpen) => (
            <Box px={2} pt={2}>
              <AppEditable2
                value={newProject}
                onChange={setNewProject}
                onSubmit={(value) => onSubmitNewProject(value, onOpen)}
                labelBtn="New Project"
              />
            </Box>
          )}
        />
      </>
    </>
  );
};

export default PartFormIdentification;
