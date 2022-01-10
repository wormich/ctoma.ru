<?php

namespace Drupal\my_tokens\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure example settings for this site.
 */
class MyTokensSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'my_tokens_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'my_tokens.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('my_tokens.settings');

    $form['clinics_default'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Clinics default (tid)'),
      '#default_value' => $config->get('clinics_default'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    \Drupal::configFactory()->getEditable('my_tokens.settings')
      ->set('clinics_default', $form_state->getValue('clinics_default'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}