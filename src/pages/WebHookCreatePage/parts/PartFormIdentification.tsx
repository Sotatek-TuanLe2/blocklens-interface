import React, { useEffect, FC, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/CreateHookForm.scss';
import { Text } from '@chakra-ui/react';
import { IAppResponse } from 'src/utils/utils-app';
import { AppEditable, AppEditableTags, AppComplete } from 'src/components';
import { IDataForm } from '..';
import _ from 'lodash';

interface IPartFormIdentificationProps {
  dataForm: IDataForm;
  setDataForm: (value: IDataForm) => void;
  onSelectProject: (app: IAppResponse | null) => void;
  validator: any;
}

const PartFormIdentification: FC<IPartFormIdentificationProps> = ({
  dataForm,
  setDataForm,
  validator,
  onSelectProject,
}) => {
  const { id: projectId } = useParams<{ id: string }>();

  const [projects, setProjects] = useState<IAppResponse[]>([]);

  const getProjects = useCallback(async () => {
    try {
      const res = await rf.getRequest('AppRequest').getListApp({});
      setProjects(res.docs);
    } catch (error: any) {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    getProjects().then();
  }, []);

  const createByProject = !!projectId;

  const optionProjects = useMemo(() => {
    return projects.map((el: IAppResponse) => ({
      value: el.projectId,
      label: el.name || '',
    }));
  }, [projects]);

  const onChangeProject = (value: string) => {
    const projectSelected = projects.find((item) => item.projectId === value);
    onSelectProject(projectSelected || null);

    if (dataForm.projectId === value) return;

    setDataForm({ ...dataForm, projectId: value });
  };

  return (
    <>
      <>
        <Text pb={1} className="title">
          Webhook Name
        </Text>
        <AppEditable
          value={dataForm.webhookName}
          onChange={(value) => {
            setDataForm({
              ...dataForm,
              webhookName: value,
            });
          }}
          validate={{
            name: `name`,
            validator: validator.current,
            rule: ['required', 'max:50'],
          }}
        />
        <Text pb={1} pt={5} className="title">
          Hashtag
        </Text>
        <AppEditableTags
          onSubmit={(value) => {
            const hashTags = dataForm?.hashTags || [];
            if (!value.trim() || hashTags.includes(value)) return;
            setDataForm({
              ...dataForm,
              hashTags: _.uniq([...hashTags, value]),
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
          disabled={createByProject}
        />
      </>
    </>
  );
};

export default PartFormIdentification;
